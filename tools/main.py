"""
Scrape data from https://docs.fivem.net/docs/game-references/weapon-models/
"""

import os
import time
import random
import json
import requests
from bs4 import BeautifulSoup
from dataclasses import dataclass, field, asdict

weapon_images_directory = "../public/weapons"
# Example: https://docs.fivem.net/weapons/WEAPON_COMPACTLAUNCHER.png
weapon_image_base_url = "https://docs.fivem.net/weapons"

weapons_json_file_path = "../src/weapons.json"


@dataclass
class Component:
    title: str
    hash: str


@dataclass
class Weapon:
    name: str
    hash: str
    model_hash_key: str
    group: str
    dlc: str
    description: str
    components: list[Component] = field(default_factory=list)
    tints: list[str] = field(default_factory=list)


def main():
    weapons: list[Weapon] = []
    if not os.path.exists(weapon_images_directory):
        os.makedirs(weapon_images_directory)

    page = requests.get("https://docs.fivem.net/docs/game-references/weapon-models/")

    soup = BeautifulSoup(page.content, "html.parser")

    doc_content_div = soup.find("div", class_="docContent")

    categories_div_list = doc_content_div.find_all("div", class_="category")

    for category in categories_div_list:
        group = category["id"]

        weapons_div_list = category.find_all("div", class_="weapon")

        print(f"Scraping group '{group}' total ({len(weapons_div_list)})")

        for weapon_div in weapons_div_list:
            weapon_info_div = weapon_div.find("div", class_="weapon-info")
            name: str | None = None
            hash: str | None = None
            model_hash_key: str | None = None
            dlc: str | None = None
            description: str = ""
            components: list[Component] = []
            tints: list[str] = []

            for span in weapon_info_div.find_all("span"):
                span_title = span.find("strong").text
                span_text = span.find(string=True, recursive=False).strip()

                match span_title:
                    case "Name:":
                        name = span_text
                    case "Hash:":
                        hash = span_text
                    case "Model Hash Key:":
                        model_hash_key = span_text
                    case "DLC:":
                        dlc = span_text
                    case "Description:":
                        description = span_text

            components_li_list = weapon_info_div.find(
                "div", class_="components"
            ).find_all("li")

            components = [
                Component(title=li["title"], hash=li.text) for li in components_li_list
            ]

            tints_li_list = weapon_info_div.find("div", class_="tints").find_all("li")

            tints = [li.text.replace(" tint", "") for li in tints_li_list]

            if (
                name is not None
                and hash is not None
                and model_hash_key is not None
                and dlc is not None
            ):
                weapon = Weapon(
                    name=name,
                    hash=hash,
                    model_hash_key=model_hash_key,
                    group=group,
                    dlc=dlc,
                    description=description,
                    components=components,
                    tints=tints,
                )

                weapons.append(weapon)
            else:
                continue

            print("\tScraping weapon")
            print(f"\t\tName: '{name}'")
            print(f"\t\tHash: '{hash}'")
            print(f"\t\tModel Hash Key: '{model_hash_key}'")
            print(f"\t\tDLC: '{dlc}'")
            print(f"\t\tDescription: '{description}'")
            print(f"\t\tComponents: {components}")
            print(f"\t\tTints: {tints}")

            # download images

            weapon_image_file = hash + ".png"

            if not os.path.exists(
                os.path.join(weapon_images_directory, weapon_image_file)
            ):
                print("\t\tDowloading image")

                image_url = os.path.join(weapon_image_base_url, weapon_image_file)

                image = requests.get(image_url)

                with open(
                    os.path.join(weapon_images_directory, weapon_image_file), "wb"
                ) as f:
                    f.write(image.content)

                time.sleep(random.choice([0.3, 0.5, 0.9, 1, 1.3, 1.7, 1.8, 2]))

            print()

    print("END -------------------------")
    print(f"Total weapons: {len(weapons)}")

    weapons_dict = [asdict(weapon) for weapon in weapons]

    data = json.dumps(weapons_dict, indent=4)

    with open(weapons_json_file_path, "w") as f:
        f.write(data)


if __name__ == "__main__":
    main()
