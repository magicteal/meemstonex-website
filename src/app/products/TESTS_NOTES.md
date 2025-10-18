Unit-test style pseudo cases (Jest + React Testing Library)

1) Create product flow
- Render <ProductsEditorPage />
- Click New Product button
- Fill Name, Price, select a Category, set Photo URL
- Click Create
- Expect: New row appears in table with provided name and price

2) Edit product validation
- Open Edit on the first row
- Clear Name input
- Attempt Save
- Expect: Inline error "Name is required" and save does not proceed.

3) Delete + Undo behavior
- Click Delete on a row, confirm
- Expect: Row removed and a toast appears with Undo
- Click Undo within 5s
- Expect: Row reappears at top of list

E2E tests (Playwright/Cypress)
- Verify keyboard shortcut "n" opens New Product modal
- Verify modal focus trap and return focus
- Verify infinite scroll loads additional pages on public products page
- Verify search debounce: typing filters results after ~300ms
