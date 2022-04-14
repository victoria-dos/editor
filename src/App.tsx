import React from 'react';

import { Menu, Pane, majorScale } from 'evergreen-ui';

import './app.css';

import MenuItem, { MenuItemProps } from './editor-core/menu-item';
import Editor from './editor-core/editor';
import TopNav from './top-nav';
import { componentMapper } from '@data-driven-forms/mui-component-mapper';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { AnyObject } from './dnd/types';
import EditorContent from './editor-content';
import PropertiesCard from './properties-card';
import { Field, FormRenderer, validatorTypes } from '@data-driven-forms/react-form-renderer';
import ContainerWrapper from './container-wrapper';
import ComponentWrapper from './component-wrapper';
import SubForm from './sub-form';
import Code from './code';
//import componentMapper from './evergreen-component-mapper/component-mapper';

const MenuItemWrapper: React.FC<MenuItemProps> = (props) => <MenuItem Component={Menu.Item} {...props} />

const fields = [
  {
    name: 'tabs', component: 'tabs', fields: [
      {
        name: 'props-tab', title: 'Props', fields: [
          {
            name: 'component',
            component: 'select',
            label: 'Component',
            description: 'Component type.',
            isRequired: true,
            validate: [{ type: 'required' }],
            options: Object.keys(componentMapper).map(key => ({
              label: key.replaceAll('-', ' '),
              value: key
            }))
          },
          {
            name: 'name',
            component: 'text-field',
            label: 'Name',
            description: 'Name of the field. You can use dot notation to nest variables.',
            isRequired: true,
            validate: [{ type: 'required' }]
          },
          {
            name: 'text-field-group',
            component: 'sub-form',
            condition: { when: 'component', is: ['text-field', 'textarea', 'checkbox', 'select', 'radio', 'switch', 'dual-list-select', 'field-array'] },
            fields: [
              { component: 'text-field', name: 'label', label: 'Label', description: 'Label of the field.' },
              { component: 'text-field', name: 'description', label: 'Description', description: 'Description of the field.' },
              { component: 'text-field', name: 'helperText', label: 'Helper text' },
              { component: 'checkbox', name: 'isRequired', label: 'Is required?' },
              { component: 'checkbox', name: 'isDisabled', label: 'Is disabled?' },
              { component: 'checkbox', name: 'isReadOnly', label: 'Is read-only?' },
            ],
          },
          {
            name: 'sub-form-group',
            component: 'sub-form',
            condition: { when: 'component', is: ['sub-form'] },
            fields: [
              { component: 'text-field', name: 'title', label: 'Title', description: 'Title of the sub-form.' },
              { component: 'text-field', name: 'description', label: 'Description', description: 'Description of the sub-form.' },
            ],
          },
          {
            name: 'options-group',
            component: 'sub-form',
            condition: { when: 'component', is: ['select', 'radio', 'checkbox', 'field-array', 'dual-list-select'] },
            fields: [
              {
                component: 'field-array', name: 'options', label: 'Options', description: 'Available options.', defaultItem: () => ({ value: `value-${Date.now()}`, label: 'label' }), fields: [
                  {
                    label: 'Label',
                    name: 'label',
                    component: 'text-field',
                    marginBottom: '4px',
                  },
                  {
                    label: 'Value',
                    name: 'value',
                    component: 'text-field',
                    marginBottom: '2px',
                  }
                ]
              },
            ],
          }
        ]
      },
      {
        name: 'validators-tabs', title: 'Validators', fields: [
          {
            label: 'Use warnings',
            name: 'useWarnings',
            component: 'checkbox',
            marginBottom: '4px',
            description: 'Enables using of warnings.'
          },
          {
            component: 'field-array', name: 'validate', label: 'Validators', description: 'Available validators.', defaultItem: {}, fields: [
              {
                label: 'Type',
                name: 'type',
                component: 'select',
                marginBottom: '4px',
                validate: [{ type: 'required' }],
                options: [
                  { label: 'None', value: null },
                  { label: 'Required', value: 'required' },
                  { label: 'Min length', value: 'min-length' },
                  { label: 'Max length', value: 'max-length' },
                  { label: 'Exact length', value: 'exact-length' },
                  { label: 'Min number value', value: 'min-number-value' },
                  { label: 'Max number value', value: 'max-number-value' },
                  { label: 'Pattern', value: 'pattern' },
                  { label: 'URL', value: 'url' },
                ]
              },
              {
                label: 'Threshold',
                name: 'threshold',
                component: 'text-field',
                marginBottom: '2px',
                condition: {
                  when: (field: Field) => `${field.name.replace('threshold', 'type')}`,
                  is: [
                    'min-length',
                    'max-length',
                    'exact-length',
                  ]
                },
                validate: [{ type: 'required' }],
                clearOnUnmount: true,
              },
              {
                label: 'Value',
                name: 'value',
                component: 'text-field',
                marginBottom: '2px',
                condition: {
                  when: (field: Field) => `${field.name.replace('value', 'type')}`,
                  is: [
                    'min-number-value',
                    'max-number-value',
                  ]
                },
                clearOnUnmount: true,
                validate: [{ type: 'required' }],
              },
              {
                label: 'Include threshold',
                name: 'includeThreshold',
                component: 'checkbox',
                marginBottom: '2px',
                condition: {
                  when: (field: Field) => `${field.name.replace('includeThreshold', 'type')}`,
                  is: [
                    'min-number-value',
                    'max-number-value',
                  ]
                },
                clearOnUnmount: true,
              },
              {
                label: 'Pattern',
                name: 'pattern',
                component: 'text-field',
                marginBottom: '2px',
                condition: {
                  when: (field: Field) => `${field.name.replace('pattern', 'type')}`,
                  is: 'pattern'
                },
                clearOnUnmount: true,
                validate: [{ type: 'required' }],
              },
              {
                label: 'Flags',
                name: 'flags',
                component: 'text-field',
                marginBottom: '2px',
                condition: {
                  when: (field: Field) => `${field.name.replace('flags', 'type')}`,
                  is: 'pattern'
                },
                clearOnUnmount: true,
              },
              {
                label: 'Message',
                name: 'message',
                component: 'text-field',
                marginBottom: '2px',
              },
              {
                label: 'Is warning?',
                name: 'warning',
                component: 'checkbox',
                marginBottom: '2px',
                description: 'Does not prevent form submit.'
              }
            ]
          },
        ]
      },
      { name: 'condition-tabs', title: 'Condition', fields: [] },
      { name: 'field-props', title: 'FieldProps', fields: [] }
    ]
  }
]

const componentInitialProps: AnyObject = {
  'dual-list-select': {
    options: []
  },
  'sub-form': {
    title: 'Sub form',
    fields: []
  },
  'field-array': {
    fields: []
  },
  wizard: {
    fields: [{ name: 'step-1', fields: [] }]
  },
  tabs: {
    fields: []
  }
}



function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Pane
        display="flex"
        flexDirection="column"
        height="100vh"
      >
        <Editor
          DropCursorProps={{
            CursorProps: {
              className: 'drop-cursor'
            }
          }}
        >
          <TopNav />
          <Pane flex="1" width="100%" display="flex">
            <Pane
              display="flex"
              position="sticky"
              flexDirection="column"
              overflowY="auto"
              maxHeight="calc(100vh - 48px)"
              paddingX={majorScale(1)}
              top="48px"
            >
              <Menu>
                <Menu.Group title="Components">
                  {Object.keys(componentMapper).map(key => <MenuItemWrapper key={key} component={key} componentInitialProps={componentInitialProps[key]}>
                    {key.replaceAll('-', ' ')}
                  </MenuItemWrapper>)}
                </Menu.Group>
              </Menu>
            </Pane>
            <Pane flex="1" display="flex" flexDirection="column">
              <FormRenderer
                schema={{ fields: [] }}
                onSubmit={() => undefined}
                componentMapper={{ ...componentMapper, 'sub-form': SubForm }}
                FormTemplate={() => <ContainerWrapper isRoot Component={ComponentWrapper} />}
              />
              <Code />
            </Pane>
            <PropertiesCard fields={fields} />
            <EditorContent fields={fields} />
          </Pane>
        </Editor>
      </Pane>
    </LocalizationProvider>
  );
}

export default App;
