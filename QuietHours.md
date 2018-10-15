# Quiet Hours

## Tests
- [ ] Before: DND off; During: DND on; After: DND off
- [ ] Before: DND on; During: DND on; After: DND on
- [ ] Before: DND off; During: DND on - turn off, shouldn't turn back on; After: DND off
- [ ] Before: DND on; During: DND on - turn off, shouldn't turn back on; After: DND off



## States

1. DND off, not quiet hours
  - Quiet hours start: turn on, state 3
  - User turns on: state 4
2. DND off, quiet hours (user)
  - Quiet hours end: state 1
  - User turns on: state 4
3. DND on, quiet hours
  - Quiet hours end: turn off, state 1
  - User turns off: state 2
4. DND on, user
  - User turns off, not quiet hours: state 1
  - User turns off, quiet hours: state 2
