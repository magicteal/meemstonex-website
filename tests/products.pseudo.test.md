# Products UI pseudo tests

These are example test cases you can convert to real Jest + React Testing Library tests.

## Create product flow
- Render Admin Products Editor (`/admin/products`), click "New Product".
- Fill Name, select/add categories, set price, upload/paste image URL, set description.
- Submit and wait for toast "Product created".
- Expect table to contain the new product row.

## Edit product validation
- Open Edit on an existing row.
- Clear the Name input.
- Submit and expect inline error message "Name is required" and form not closing.
- Fix the name and submit, expect success toast.

## Delete + undo behavior
- Click Delete on a row, confirm in modal.
- Expect toast "Product deleted" with Undo action visible for 5 seconds.
- Click Undo; expect the product row to reappear in the list.

---

E2E tests: add coverage for search/filter/sort, infinite scroll fetches next page, modals trap focus and restore focus after close, and keyboard shortcut `n` opens the create modal in admin.
