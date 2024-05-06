// "use client"

// import { Location } from "@/type/location";
// import { createContext, useState } from "react";




// export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
//   const [loc, setLoc] = useState<Location>({
//     name: "",
//     category: "museum",
//     hours: [[0, 0], [20, 34], [20, 34], [20, 34], [20, 34], [20, 34], [0, 0]],
//     importance: 1,
//     lon: 0,
//     lat: 0,
//     zoom: 15,
//     imgs: [],
//     map: "google",
//     status: {
//       checkSum: "",
//       isArchived: false,
//       isDeleted: false,
//       archivedAt: undefined,
//       createdAt: new Date(),
//     },
//   });
//   const finish = () => {
//     setOpen(false);
//     if (id === -1) {
//       account?.locsDispatch({ type: "add", loc: loc });
//     } else {
//       account?.locsDispatch({ type: "edit", loc: loc });
//     }
//   }
//   const [id, setId] = useState<number>(-1);
//   const [open, setOpen] = useState<boolean>(false);
//   const locEditor = { loc, setLoc, id, setId, open, setOpen, finish };

//   const editorContext = { locEditor };

//   return (
//     <EditorContext.Provider value={editorContext}>{children}</EditorContext.Provider>
//   );
// }