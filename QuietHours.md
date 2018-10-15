# Quiet Hours

## Tests
- [x] 1 -> 3
- [x] 1 -> 4
- [x] 2 -> 1
- [x] 2 -> 4
- [x] 3 -> 1
- [x] 3 -> 2
- [x] 4 -> 1
- [x] 4 -> 2



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
