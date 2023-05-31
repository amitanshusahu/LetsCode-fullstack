/// ---- TRADE OFFS -----
/*
the solutionfunction can't take in arrays or objects
only all the primitive datatypes along with string can be used as input parmas
*/


module.exports.problems = [{
    problemId: 1,
    title: "Hello World",
    difficulty: "Easy",
    desc: {
        info: "print Hello World",
        ex1: "output: Hello World",
        note: "it should complete in O(1), and some info... blala"
    },
    submissions: 12,
    accepted: 10,
    acceptance: "95%",
    template: {
        js: "// start code",
        c: "//start code",
        cpp: "start code",
    },
    solutionfunction: null,
    testcases: [
        {
            output: "Hello World"
        }
    ],

}, {
    problemId: 2,
    title: "Sum of 2 Numbers",
    difficulty: "Medium",
    desc: {
        info: "the function takes 2 parameter they are 2 numbers as input and prints the sum to the console as output",
        ex1: "input: 1, 2 \n output: 3",
        ex2: "input: 3, 2 \n output: 5",
        note: "it should complete in O(1), and some info... blala"
    },
    submissions: 12,
    accepted: 10,
    acceptance: "90%",
    template: {
        js:
            `function add(num1, num2){
    /* code here */
    
}`,
        c:
            `#include<stdio.h>

void add(int num1, int num2)
{
    // code here
}

/* only write the main function when you want to debug the code using the "Run" button */`,
        cpp:
            `#include<iostream>
using namespace std;

void add(int num1, int num2)
{
    //code here
}

/* only write the main function when you want to debug the code using the "Run" button*/
`
    },
    solutionfunction: "add",
    testcases: [
        {
            input: [2, 3],
            output: 5
        },
        {
            input: [1, 2],
            output: 3
        }
    ]
},
{
    problemId: 3,
    title: "difference of 2 Numbers",
    difficulty: "Medium",
    desc: {
        info: "the function takes 2 parameter they are 2 numbers as input and prints the difference to the console as output",
        ex1: "input: 1, 2 \n output: 1",
        ex2: "input: 3, 2 \n output: 1",
        note: "it should complete in O(1), and some info... blala"
    },
    submissions: 12,
    accepted: 10,
    acceptance: "90%",
    template: {
        js:
            `function diff(num1, num2){
    /* code here */
    
}`,
        c:
            `#include<stdio.h>

void diff(int num1, int num2)
{
    // code here
}

/* only write the main function when you want to debug the code using the "Run" button */`,
        cpp:
            `#include<iostream>
using namespace std;

void diff(int num1, int num2)
{
    //code here
}

/* only write the main function when you want to debug the code using the "Run" button*/
`
    },
    solutionfunction: "diff",
    testcases: [
        {
            input: [2, 3],
            output: 1
        },
        {
            input: [1, 2],
            output: 1
        }
    ]
}

];