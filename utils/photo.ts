//set env from .env.local

import { bucket } from "@/database/storage";
import sharp from "sharp";

//based on reference above but use await
export const uploadFromUrl = async (
  url: string,
  filename: string,
  resize?: number[]
) => {
  const res = await fetch(url);
  const res_blob = await res.blob();
  const blob = bucket.file(filename);
  let buffer = await res_blob.arrayBuffer();
  //resize blob image
  if (resize) {
    buffer = await sharp(buffer).resize(resize[0], resize[1]).toBuffer();
  }

  await blob.save(Buffer.from(buffer), {
    resumable: false,
    metadata: {
      contentType: res_blob.type,
    },
  });
  await blob.makePublic();
  return blob.publicUrl();
};

export const uploadMapPhoto = async (
  url: string,
  account: string,
  profile: string,
  name: string
) => {
  const fileName = `${new Date().toISOString()}.png`;
  const upl_url = await uploadFromUrl(
    url,
    `Mapman/${account}/${profile}/${name}/${fileName}`
  );
  const resized_url_128 = await uploadFromUrl(
    upl_url,
    `Mapman/${account}/${profile}/${name}/resized/128/${fileName}`,
    [128, 128]
  );
  const resized_url_512 = await uploadFromUrl(
    upl_url,
    `Mapman/${account}/${profile}/${name}/resized/512/${fileName}`,
    [512, 512]
  );
  return upl_url;
};

// const f = async () => {
//   // const url = await uploadFromUrl(
//   //   "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/San_Francisco_from_the_Marin_Headlands_in_August_2022.jpg/1920px-San_Francisco_from_the_Marin_Headlands_in_August_2022.jpg",
//   //   "images/photo.jpg"
//   // );
//   const images = [
//     "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZnGQvhTKDz0u2VwuPoBDewQpMDPjg7PRHIRr5O_9RrmMMSwdL5ylRj5z5uF5wzYDWqRDIxgMKqnZiMrXT9ZUtDYOuecKphreLgXc4fC8HpZGIo-u4HXCuU3KWOZ8fF6Agknolzoh8CaMT4iOSPD0RsXzGtyRpmg8UGIRlYZRLlumpSv&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
//     "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZnSz4rScYgN1MeFr0vL3YMBSrDePlVTu21PGus9nfa4NI0ysIeTD2NoCqifZcvR3ng0jN8QyvYDs22Ehebo50jxflgaHzbpuo3SzkzH5Yvtd9bL0l1IwNfTjnwrDWIH51fgSZH4GboDBZHy3MwRy9JVJrjSA7qLP_2BQTFQ_GI_xHGX&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
//     "https://maps.googleapis.com/maps/api/place/photo?maxwidth=512&photo_reference=AUGGfZl_DDdNC04yWEsSwgLEBLpNhtjHuWiPYH5EGGqpa9Rt8TjvEgoMwLWSeUsvtbDUGZbw9igkzAc8DHeAqjO4dhe7tbHvZVvwBiwJ5yagW4rI94BXnNrR5AWddQuQB0gwihl4Q3h5rkBRuu3FcYS9TS3bfU2mol4orDw56rQxEwKdjSo-&key=AIzaSyCULycAPjDrQH-aW0KHHoBgKpfLPRBs-Es",
//   ];
//   const converted = await Promise.all(
//     images.map(async (image) => {
//       const url = await uploadMapPhoto(
//         image,
//         "mapman",
//         "Default",
//         "Golden Gate Bridge"
//       );
//       return url;
//     })
//   );

//   console.log(converted.map((url) => decodeURIComponent(url)));
// };

// f();
