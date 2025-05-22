Using the language of your choice—from the C#/JavaScript/TypeScript/Java/PHP/Ruby/Python/Rust set, please—to write ***a console script*** that implements a ***generalized*** non-transitive dice game (with the supports of arbitrary values on the dice). Of course, _it's recommended to use the language of your "specialization,"_ i.e. C# or JavaScript/TypeScript, but it's not required.

When launched with ***command line parameters***—arguments to the `main` or `Main` method in the case of Java or C# correspondingly, `sys.argv` in Python, `process.argv` in Node.js, etc.—it accepts 3 or more strings, each containing 6 comma-separated integers. E.g., `python game.py 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3`. In principle, you may support any number of faces on a dice, like 4 or 20, but it's not very important.

If the arguments are incorrect, you must display a neat error message,not a stacktrace—what exactly is wrong and an example of how to do it right (e.g., user specified only two dice or no dice at all, used non-integers, etc.). All messages should be in English.

Important: ***dice configuration is passed as command line arguments***; you don't "parse" it from the input stream.

The victory is defined as follows—computer and user select different dice, perform their "rolls," and whoever rolls higher wins. 

The first step of the game is to determine who makes the first move. You have to prove to the user that choice is fair (it's not enough to generate a random bit 0 or 1; the user needs a proof of the fair play). 

When the users make the roll, they select dice using CLI "menu" and "generate" a random value with the help of the computer. The options consist of all the available dice, the exit (cancel) option, and the help option.

When the computer makes the roll, it selects dice and "generates" a random value. 

Of course, "random" generation is also should be provable fair.

So, you need to implement provable "fair" random integer generation (other from 0 to 1 or from 0 to 5).

To generate such a value, the computer generates a one-time ***cryptographically secure random key*** (using corresponding API like SecureRandom, RandomNumberGenerator, random_bytes, etc.—it's **mandatory**) with a length of ***at least 256 bits***.

Then the computer generates a _uniformly_ distributed integer in the required range (using secure random; note that `%` operator is not enough to get uniform distribution) and calculates HMAC (based on SHA3) from the generated integers as a message with the generated secret key. Then the computer displays the HMAC to the user. 

After that, the user selects an integer in the same range. The resulted value is calculated as the sum of user number and computer number using modular arithmetic. When the computer displays the result, it also shows the used secret keys.

Re-read the paragraph above; the sequence is critical (it simply doesn't make sense to do it differently, for example, showing the key before the user number selection or displaying HMAC the second time instead of the key, etc.).

Note that _each_ "fair random generation" requires the participation of both parties, the user and the computer; just to generate random number and print it is not enough.

Thus the user can check that the computer doesn't cheat (of course, the computer can still try to cheat, but the user can counteract to that).

When you select the "help" option in the terminal, you need to display a table (use ASCII-graphic) that shows probabilities of winning for each dice pair.

The table generation should be in a separate class. The probability calculation should be in a separate class. The implementation of the fair number generation "protocol" should be in a separate class. The random key/number generation and HMAC calculation should be in a separate class. The dice configuration parsing should be in a separate class. The dice abstraction should be in a separate class. Generally, your code should consist of at least 6-9 classes. 

You should use the core class libraries and third-party libraries to the maximum, and not reinvent the wheel. 

THE NUMBER OF DICE CAN BE ARBITRARY ( > 2).

Example (of course, Java is used only as example, you will use language of your group):
```markdown
> java -jar game.jar 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3
Let's determine who makes the first move.
I selected a random value in the range 0..1 (HMAC=C8E79615E637E6B14DDACA2309069A76D0882A4DD8102D9DEAD3FD6AC4AE289A).
Try to guess my selection.
0 - 0
1 - 1
X - exit
? - help
Your selection: 0
My selection: 1 (KEY=BD9BE48334BB9C5EC263953DA54727F707E95544739FCE7359C267E734E380A2).
I make the first move and choose the [6,8,1,1,8,6] dice.
Choose your dice:
0 - 2,2,4,4,9,9 
1 - 7,5,3,7,5,3
X - exit
? - help
Your selection: 0 
You choose the [2,2,4,4,9,9] dice.
It's time for my roll.
I selected a random value in the range 0..5 (HMAC=AA29E7275FE17A8D1184E2D4B6B0F46D815224270C94907CF007F2118CF400F7).
Add your number modulo 6.
0 - 0
1 - 1
2 - 2
3 - 3
4 - 4
5 - 5
X - exit
? - help
Your selection: 4
My number is 3 (KEY=7329ABD54A1633D2079EA7A48B401018D7EE6DD4C130AB5C31BC029CC8359637).
The fair number generation result is 3 + 4 = 1 (mod 6).
My roll result is 8.
It's time for your roll.
I selected a random value in the range 0..5 (HMAC=652863C27870CCA331458F4658D89413F405736FE5AA19B868FBDDAB5611A406).
Add your number modulo 6.
0 - 0
1 - 1
2 - 2
3 - 3
4 - 4
5 - 5
X - exit
? - help
Your selection: 5
My number is 0 (KEY=92564A82A515DEBC3FE9842D20DCEA3F3AAFB2080314A09A1E9A2CC729EDAF44).
The fair number generation result is 0 + 5 = 5 (mod 6).
Your roll result is 9.
You win (9 > 8)!
```
Note that the second player (user or computer, depending on whether user have guessed the computer choice `0`/`1` ornnot) cannot select the dice selected by the first player (computer or user).
The first "fair generation" (`0` or `1`) should determine who selects the dice first. The opponents select different dice and after that dice rolls are performed (in fact, _the order of rolls should be unimportant, because they use different dice_). Of course, both computer's and user's rolls should be "fair" (use "input" from both parties).

**What is this task for? **

You need to learn _how to read and understand the requirements_, understand hash functions a little bit deeper, understand what they are for, know the HMAC concept, learn to think about how the exact sequence of steps can give you some kind of proof or contract, work with external libraries, touch on some basics of OOP, and a few other things.

**DEADLINE for this task is the 26.05.2025.**

Note that "fair" procedure generates dice face index, not the "roll result." Users can specify any order for face values when they run the application.

Sometimes words aren't enough, so here is a diagram for collaborative random number generation in the range from `0` to `5` inclusive for the TASK #3 (it should used for both user's and computer's moves as well initial "who selects the dice first" determination). 
```
+---+---------------------------+---------------------+
| # | Computer                  | User                |
+---+---------------------------+---------------------+
| 1 | Generates a random number |                     |
|   | `x ∈ {0,1,2,3,4,5}`       |                     |
+---+---------------------------+---------------------+
| 2 | Generates a secret key    |                     |
+---+---------------------------+---------------------+
| 3 | Calculates and displays   |                     |
|   | `HMAC(key).calculate(x)`  |                     |
+---+---------------------------+---------------------+
| 4 |                           | Selects a number    |
|   |                           | `y ∈ {0,1,2,3,4,5}` |
+---+---------------------------+---------------------+
| 5 | Calculates the result     |                     |
|   | `(x + y) % 6`             |                     |
+---+---------------------------+---------------------+
| 6 | Shows both the result     |                     |
|   | and the key               |                     |
+---+---------------------------+---------------------+
```

How to improve usability of the console help table (make it more understandable).
First of all, you may render header row with some emphasis. E.g. use some color. 
Second, you fill the headers with some adequate content, like this:
```php
Probability of the win fоr the user:
+-------------+-------------+-------------+-------------+
| User dice v | 2,2,4,4,9,9 | 1,1,6,6,8,8 | 3,3,5,5,7,7 |
+-------------+-------------+-------------+-------------+
| 2,2,4,4,9,9 | - (0.3333)  | 0.5556      | 0.4444      |
+-------------+-------------+-------------+-------------+
| 1,1,6,6,8,8 | 0.4444      | - (0.3333)  | 0.5556      |
+-------------+-------------+-------------+-------------+
| 3,3,5,5,7,7 | 0.5556      | 0.4444      | - (0.3333)  |
+-------------+-------------+-------------+-------------+
```
Please, remember that integers can be larger than `9`, so you cannot predefine the column widths. 

> Anyway, **you have to use a 3rd-party library for the table output**. 

The diagonals are formatted differently, because the dice cannot play against itself, but it is still possible to calculate the probability; you may simple print `-` or just print the probability, if you want.

And, last, but not least, you may *add some text before the table* (e.g., to help to understand the game rules).

Of course, for large number of dice it would be nice to implement some kind of pagination, but it's out of the scope of the basic task (you may consider it as an optional "for the highest grade" problem).

OK, just a few more hint/explanations about #3:
1. You **have to** use base class libraries and 3rd-party libaries for the implementation (esp. for console table generation).
2. Your code generates a secret key first, then it generates a random value and then show **only** HMAC to the user. After that the user generates their value. Then your code shows its number, sum, generated move as well as the secret key. And then user can check the fact that the computer value and the secret key give together exactly the same HMAC that was shown before.
3. You may generate a link that allows HMAC calculation to simplify the "check" for the user, but it's not required. And definitely your don't need to create a separate app to check HMAC, the idea is that user may not trust the code you wrote.
4. A value from the computer and a value from the user are needed to make a single roll. So, the computer have to generate 3 numbers (0..1 to determine who select the dice first, 0..5 for the user roll and 0..5 for the computer roll) and the user have to enter 3 numbers (0..1 to determine who select the dice first, 0..5 for own roll and 0..5 for the computer roll). Or, in other words, each generation requires the participation of both parties, the user and the computer. Of course, there will be also 3 keys and 3 HMAC per game in total.
5. The “protocol” with HMAC allow to generate 2 numbers (one by computer, one by user) “in parallel”, independently — when user selects their  number, he/she doesn’t know the computer selection yet, but the computer cannot change its selection after user’s moves. So, the result depends on computer number AND user number. And it’s necessary to “glue” two numbers to get a uniform distribution. The simplest way is to use modular addition.