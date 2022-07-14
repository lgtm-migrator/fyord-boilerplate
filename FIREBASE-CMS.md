# Firebase CMS Additions

Heavily based on previous work with tsbase-components and our cms branch on the tsbase-boilerplate project.

## File structure needed to migrate tsbase-boilerplate cms work

- src
  - [x] services
    - [x] authentication
    - [x] contentRepository
    - [x] formInput
  - [x] models
    - [x] Content
  - pages
    - [-] default
    - [x] login
    - [-] crudForm
      - [ ] inputs
        - [ ] input
        - [ ] text
        - [ ] textArray
        - [ ] html
        - [ ] checkbox
        - [ ] select
        - [ ] object
        - [ ] objectArray
    - [x] contentList
  - components
    - [x] editableContent
    - [x] crudButton
    - [-] quill
