# Shanty

Statically typed imperative language

## Overview
Implemented in TypeScript. Main use case - generation of Kubernetes deployment resource manifests from provided validated data.

Basic features:
* Primitive (integer, string, rune, boolean) and complex types (like structures)
* Embeded user, repo, ciConfig, deployment types
* Small standard library with basic functions like print, type conversion and data validation for embeded types
* if and while control statements

## Interpreter building process and usage
1. Install nodejs and npm
2. Inside project folder execute npm i, then npm run build
3. Navigate inside dist folder, where you can call node command to execute different parts like lexer, parser, semantic analyzer or complete interpreter

## Language overview

### Supported types

Numbers are reprsented with integer type, supporting +, -, * and / operators along with parentesis. Integer is enough for manifest rendering as they don't have non-integer values

Strings are like in most other languages

`"Example of string"`

Rune is a single character string (like in Golang)

`'e'`

### Functions

Functions can be commands (no return value) or have return value. Commands are declared with command keyword. Functions are declared with func keyword followed by it's type

```typescript
command myCommand(boolean b) {...}
func integer myIntFunc(string x) {...}
```

If function has no parameters, void keyword should be provided inside parentesis instead.

```typescript
func boolean noParams(void) {...}
```

Functions can be declared inside other functions, but they still act as global, meaning that they are not first class objects and there are no closures.

### Control flow

Assignment - nothing unusual for primitive types, but complex types can be assigned with block or by accessing some specific property

```typescript
var repo ClipperFront;

ClipperFront = {
    fullName = "clipper-front";
    owner = Revan730;
    url = "https://github.com/revan730/clipper-front";
    branch = "dev";
}

ClipperFront.branch = "master";
```

### If statement

Conditional expression must evaluate to boolean type, else block is optional

```typescript
if (myParam > 10) {
    return 100;
}
```

### While statement

Conditional expression must evaluate to boolean type. Semantic analyzer will fail if identifiers from conditional expression are not used in loop body, which probably means that loop will never exit

### Semicolons

all statements but blocks must end with semicolons

```typescript
myTypeVar = {
    a = "a value"; // Semicolon inside block
    b = 12;
} // block, semicolon not required

print(itoa(myInt)); // semicolon required
```

## How interpreter works

Running the program consists of two major steps:
1. Building and validating AST tree against semantic rules
2. Executing statements from AST, evaluating expressions in process

Language is statically typed so static analysis is performed by semantic analyzer before execution.

### Parsing to AST

To build AST, source code is scanned for known tokens using lexer. If token is unknown, process fails. This part is defined in lexer.ts file.

Parser then searches for statements and expressions using syntax rules. It inserts nodes to AST according to scopes and execution flow.

Some overview of AST nodes:
* expression - interface for concrete expression types
* funcCallStatement - statement which starts function execution with provided parameters
* notExpression - applies logical not operation to child expression

After AST is built, semantic analyzer traverses it and performs check against semantic rules according to AST node type.

Some examples of semantic rules:
* SH19: Trying to call func <id> but it's not declared
* SH27: Plus op is only appliable to integer or string types, got <type>

When all the rules are checked, interpter begins traversing AST, executing each statement according to it's type, evaluating expressions in process.

### Native TS\JS functions

As this interpreter is written in Typescript, Javascript functions can be wrapped in Shanty function definitions. Example can be seen in stdlib/print.ts. You can also provide library functions as AST definitions, but they will work slower.