#!/usr/bin/env python3

def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

def get_number(prompt):
    while True:
        try:
            return float(input(prompt))
        except ValueError:
            print("Please enter a valid number.")

def get_operation():
    operations = {
        '1': ('Addition', add),
        '2': ('Subtraction', subtract),
        '3': ('Multiplication', multiply),
        '4': ('Division', divide)
    }
    
    print("\nSelect operation:")
    for key, (name, _) in operations.items():
        print(f"{key}. {name}")
    
    while True:
        choice = input("Enter choice (1-4): ")
        if choice in operations:
            return operations[choice][1]
        print("Invalid input. Please enter 1, 2, 3, or 4.")

def main():
    print("Simple Calculator")
    print("=================")
    
    while True:
        try:
            num1 = get_number("Enter first number: ")
            operation = get_operation()
            num2 = get_number("Enter second number: ")
            
            result = operation(num1, num2)
            print(f"\nResult: {result}")
            
        except ValueError as e:
            print(f"Error: {e}")
        except KeyboardInterrupt:
            print("\nCalculator stopped.")
            break
        
        continue_calc = input("\nDo another calculation? (y/n): ").lower()
        if continue_calc != 'y':
            break
    
    print("Thank you for using the calculator!")

if __name__ == "__main__":
    main()