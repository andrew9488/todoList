import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import {Meta, Story} from '@storybook/react/types-6-0';
import {EditableSpan, EditableSpanPropsType} from "./EditableSpan";

export default {
    title: 'TodoList/EditableSpan',
    component: EditableSpan,
    argTypes: {
        changeItem: {
            description: "Value editableSpan changed"
        },
        title: {
            defaultValue: "React",
            description: "Start value editableSpan"
        }
    }
} as Meta;

const Template: Story<EditableSpanPropsType> = (args) => <EditableSpan {...args} />;

export const EditableSpanStories = Template.bind({})
EditableSpanStories.args = {}
