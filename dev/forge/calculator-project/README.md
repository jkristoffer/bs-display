# Simple Calculator

A basic command-line calculator written in Python that performs arithmetic operations.

## Features

- Addition
- Subtraction
- Multiplication
- Division (with zero-division error handling)
- Input validation
- Interactive menu system
- Continuous calculations until user exits

## Requirements

- Python 3.x

## Usage

1. Run the calculator:
   bash
   python calculator.py
   

2. Follow the prompts to:
   - Enter your first number
   - Select an operation (1-4)
   - Enter your second number
   - View the result

3. Choose whether to perform another calculation or exit

## Operations

1. **Addition**: Adds two numbers
2. **Subtraction**: Subtracts the second number from the first
3. **Multiplication**: Multiplies two numbers
4. **Division**: Divides the first number by the second (handles division by zero)

## Error Handling

- Invalid number inputs are caught and user is prompted to re-enter
- Division by zero is prevented with appropriate error message
- Keyboard interrupts (Ctrl+C) are handled gracefully

## Example


Simple Calculator
=================
Enter first number: 10

Select operation:
1. Addition
2. Subtraction
3. Multiplication
4. Division
Enter choice (1-4): 1
Enter second number: 5

Result: 15.0

Do another calculation? (y/n): n
Thank you for using the calculator!
