`use strict`

class Factor {
    constructor(value, degree) {
        this.value = value
        this.degree = degree
    }
}

const input = process.argv[2]

const refactor = input => {
    let arr = input.split(/=/)
    let id = 0
    let ret = []
    // TWO SIDES OF EQUATION
    while (id < 2) {
        let part = arr[id].split(/([+-])/)
        let sign
        let i = 0
        // CUT INTO DEGREES
        while (i < part.length) {
            sign = 0
            if (part[i] == '+')
                sign = 1
            else if (part[i] == '-')
                sign = -1
            if (sign != 0)
                i++
            if (sign == -1)
                part[i] = '-' + part[i].trim()
            else
                part[i] = part[i].trim()
            i++
        }
        // REMOVE SIGNS
        part = part.filter(elem => {
            return (elem != '+' && elem != '-') 
        })
        // CREATE CLASSES FROM RAW DATA
        ret[id] = []
        part.forEach(element => {
            let factor = element.split(/\*/)
            factor.forEach((value, index, tab)=> {
                tab[index] = value.trim()
            })
            if (factor[1] != undefined)
                ret[id].push(new Factor(factor[0], factor[1].substr(2)))
            else
                ret[id].push(new Factor(factor[0], '0'))
        });
        id++
    }
    return ret
}

const reduce = arr => {
    let firstPart = arr[0]
    let secondPart = arr[1]
    firstPart.sort((a, b) => {
        return a.degree > b.degree
    })
    secondPart.sort((a, b) => {
        return a.degree > b.degree
    })
    firstPart.forEach((elem, index, tab) => {
        tab[index].value = parseFloat(elem.value)
        tab[index].degree = parseInt(elem.degree)
    })
    secondPart.forEach((elem, index, tab) => {
        tab[index].value = parseFloat(elem.value)
        tab[index].degree = parseInt(elem.degree)
    })
    firstPart.forEach(firstFactor => {
        let reduceFactor = secondPart.find(secondFactor => {
            return secondFactor.degree == firstFactor.degree
        })
        if (reduceFactor != undefined) {
            firstFactor.value = firstFactor.value - reduceFactor.value
            secondPart.pop()
        }
    })
    let stringForm = "Reduced form: "
    firstPart.forEach((elem, index, tab) => {
        let degreeForm
        if (elem.degree == 0)
            degreeForm = ""
        else if (elem.degree == 1)
            degreeForm = " * X"
        else {
            degreeForm = " * X^" + elem.degree
        }
        stringForm += (elem.value > 0 && index != 0 ? '+ ' : '')
        if (elem.value >= 0)
            stringForm += elem.value + degreeForm + " "
        else
            stringForm += "- " + parseFloat(-elem.value) + degreeForm + " "
    })
    stringForm += "= 0"
    console.log(stringForm)
}

const check_input = arr => {
    arr.forEach((part) => {
        part.forEach((factor, index, tab) => {
            if (isNaN(parseFloat(factor.value)) || isNaN(parseInt(factor.degree))) {
                console.log("Error in input: " + factor.value + " or " + factor.degree + " is not a valid number")
                process.exit(1)
            }    
        })
    })
    return (1)
}

const sqrt = function(x) {
    isOk = guess => {
        return Math.abs(guess * guess - x) / x < 0.001;
    }
    improve = guess => {
        return (guess + x / guess) / 2;
    }
    sqrIter = guess => {
        return (isOk(guess)) ? guess : sqrIter(improve(guess))
    }
    return sqrIter(1.0);
}

arr = refactor(input)
check_input(arr)
reduce(arr)

let degree = arr.reduce((a, b) => {
    return Math.max(a.length, b.length);
}) - 1
if (degree != 0)
{
    console.log("Polynomial degree: " + degree)
    if (degree == 2) {
        let delta = arr[0][1].value * arr[0][1].value - 4 * (arr[0][2].value * arr[0][0].value)
        if (delta > 0) {
            console.log("Discriminant is strictly positive, the two solutions are:")
            console.log((-arr[0][1].value - sqrt(delta)) / (2 * arr[0][2].value) + "  ((-b − √Δ ) / (2a))")
            console.log((-arr[0][1].value + sqrt(delta)) / (2 * arr[0][2].value) + "  ((−b + √Δ ) / (2a))")
        } else if (delta < 0) {
            console.log("Discriminant is strictly negative, the two solutions are:")
            console.log("(-" + arr[0][1].value + " - i * " + sqrt(-delta) + ") / (" + "2 * " + arr[0][2].value + ")")
            console.log("(-" + arr[0][1].value + " + i * " + sqrt(-delta) + ") / (" + "2 * " + arr[0][2].value + ")")
        } else if (delta == 0) {
            console.log("Discriminant is zero, the solution is:")
            console.log((-arr[0][1].value) / (2 * arr[0][2].value) + "  (−b / (2a))")
        }
    } else if (degree == 1) {
        console.log("The solution is:")
        console.log(arr[0][0].value / -arr[0][1].value)
    } else if (degree > 2) {
        console.log("The polynomial degree is stricly greater than 2, I can't solve.")
    }
} else if (degree == 0) {
    console.log("Every real number is solution to the equation")
}