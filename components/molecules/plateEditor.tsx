"use client";

import {
  Plate,
} from "@udecode/plate-common";




























import {
  CommentsProvider,
} from "@udecode/plate-comments";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { MentionCombobox } from "@/components/plate-ui/mention-combobox";


import { CommentsPopover } from "@/components/plate-ui/comments-popover";
import { Editor } from "@/components/plate-ui/editor";
import { plugins } from "@/lib/plate/plate-plugins";

const initialValue = [
  {
    id: "1",
    type: "p",
    children: [{ text: "" }],
  },
];
{
  /* <FixedToolbar>
            <FixedToolbarButtons />
          </FixedToolbar>
          <FloatingToolbar>
          <FloatingToolbarButtons />
        </FloatingToolbar> */
}
type Props = {
  text?: string;
  setText: (text: string) => void;
};
export function PlateEditor({ text, setText }: Props) {
  return (
    <DndProvider backend={HTML5Backend}>
      <CommentsProvider users={{}} myUserId="1">
        <Plate
          plugins={plugins}
          initialValue={[
            { type: "p", children: text ? JSON.parse(text) : [{ text: "" }] },
          ]}
          onChange={(newValue) => {
            setText(JSON.stringify(newValue));
          }}
        >
          <Editor placeholder="Take a note..." />

          <MentionCombobox items={[]} />
          <CommentsPopover />
        </Plate>
      </CommentsProvider>
    </DndProvider>
  );
}
