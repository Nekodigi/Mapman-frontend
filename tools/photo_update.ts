import { fs_a } from "@/database/firestore";
import { bucket } from "@/database/storage";
import { Account } from "@/type/account";
import { Profile } from "@/type/profile";
import { photo2url } from "@/utils/location-server";
import { uploadMapPhoto } from "@/utils/photo";
import fs from "fs";

//! make sure to await actual upload in photo.ts

const LIMIT_IMGS = 3;
// open local/account.json
const account = JSON.parse(
  fs.readFileSync("local/account.json", "utf-8")
) as Account;

const profile_update = async (profile: Profile) => {
  profile.locations = await Promise.all(
    profile.locations.map(async (loc) => {
      const imgs: string[] = [];
      const others: string[] = [];
      let count = 0;
      // if from maps.googleapis.com
      loc.imgs.forEach((img) => {
        if (img.match(/maps.googleapis.com/) !== null) {
          if (count < LIMIT_IMGS) {
            //replace max width with 1920
            img = img.replace(
              /maxwidth=[0-9]+/,
              "maxwidth=1280&maxheight=1280"
            );
            //console.log(img);
            imgs.push(img);
            count++;
          }
        } else {
          others.push(img);
        }
      });
      loc.imgs = await Promise.all(
        imgs.map(async (img) => {
          return await uploadMapPhoto(
            img,
            account.email,
            profile.name,
            loc.name
          );
        })
      );
      //add others to first
      loc.imgs = others.concat(loc.imgs);
      return loc;
    })
  );
  return profile;
};

const f = async () => {
  // let profile = account.profiles[0];
  // console.log(profile);
  console.log("updating");
  account.profiles = await Promise.all(
    account.profiles.map(async (profile) => {
      console.log(profile.name);
      return await profile_update(profile);
    })
  );
  console.log("writing to local/account_new.json");
  fs.writeFileSync("local/account_new.json", JSON.stringify(account, null, 2));
  // upload to firestore
  console.log("uploading to firestore");
  await fs_a.doc(account.email).set(account);
};

f();
