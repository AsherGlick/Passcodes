#include <vector>
  //////////////////////////////////////////////////////////////////////////////
 //////////////////////// BASE MODIFICATION FUNCTIONS ///////////////////////// 
//////////////////////////////////////////////////////////////////////////////  

/************************** CALUCLATE NEW BASE LENGTH *************************\
| This function calculates the maximum number of digits that can be in a       |
| number of a given base given the number of digits it is in another base.     |
\******************************************************************************/
int calculateNewBaseLength(int oldBase, int oldBaseLength, int newBase) {
    double logOldBase = log(oldBase);
    double logNewBase = log(newBase);
    double newBaseLength = oldBaseLength * (logOldBase/logNewBase);
    int intNewBaseLength = newBaseLength;
    if (newBaseLength > intNewBaseLength) intNewBaseLength += 1;  // round up
    return intNewBaseLength;
}

/********************************* TRIM NUMBER ********************************\
| This function takes in a vector representing a multi digit number and        |
| removes all of the preceding zero value digits returning a vector of only    |
| meaningful digits.                                                           |
\******************************************************************************/
std::vector<int> trimNumber(std::vector<int> v) {
    std::vector<int>::iterator i = v.begin();
    while (i != v.end()-1) {
        if (*i != 0) {
            break;
        }
        ++i;
    }

    return std::vector<int>(i, v.end());
}

/******************************* TEN IN OLD BASE ******************************\
| This function converts the value of the old base to it's equivilant value    |
| in the new base. This is used when calulating the effect each digit of the   |
| old base has on each digit of the new base.                                  |
\******************************************************************************/
std::vector<int> tenInOldBase(int oldBase, int newBase) {
    int newBaseLength = calculateNewBaseLength(oldBase, 2, newBase);
    int maxLength = newBaseLength>2?newBaseLength:2;

    std::vector <int> newNumber(maxLength, 0);

    int currentNumber = oldBase;
    for (int i = maxLength-1; i >=0; i--) {
        newNumber[i] = currentNumber % newBase;
        currentNumber = currentNumber / newBase;
    }

    newNumber = trimNumber(newNumber);
    return newNumber;
}

/*************************** MULTIPLY ARBITRARY BASE **************************\
| This function takes two numbers that are the same arbitrary base and         |
| multiplies them together returning a vector containing the product of the    |
| two numbers in the same base that they were originally in                    |
\******************************************************************************/
std::vector<int> multiply(int base, std::vector<int> firstNumber, std::vector<int> secondNumber) {
    int resultLength = firstNumber.size() + secondNumber.size();
    std::vector<int> resultNumber(resultLength, 0);

    // Do basic long multiplication on the numbers
    for (int i = firstNumber.size() - 1 ; i >= 0; i--) {
        for (int j = secondNumber.size() - 1; j >= 0; j--) {
            resultNumber[i+j + 1] += firstNumber[i] * secondNumber[j];
        }
    }

    // Flatten number to base
    for (int i = resultNumber.size() -1; i > 0; i--) {
        if (resultNumber[i] >= base) {
            resultNumber[i-1] += resultNumber[i]/base;
            resultNumber[i] = resultNumber[i] % base;
        }
    }
    return trimNumber(resultNumber);
}

/***************************** CALCULATE NEW BASE *****************************\
| The calculate new base function takes in a number of one base and converts   |
| it to a number of another base. It does this by converting the value of      |
| each digit of the old number into its corisponding value in the new base     |
| and summing all the numbers                                                  |
\******************************************************************************/
std::vector<int> calculateNewBase(int oldBase, int newBase, std::vector<int> oldNumber) {
    int newLength = calculateNewBaseLength(oldBase, oldNumber.size(), newBase);
    std::vector<int> newNumber(newLength, 0);
    std::vector<int> oldBaseTen = tenInOldBase(oldBase, newBase);

    // The starting conversion value is 1 ( 1 = 1 for every base)
    std::vector<int> conversionValue(1, 1);
    
    // add each value of the digits of the old number to the new number
    for (int i = oldNumber.size()-1; i >= 0; i--) {
        for (unsigned int j = 0; j < conversionValue.size(); j++) {
            int newNumberIndex =  j + newLength - conversionValue.size();
            newNumber[newNumberIndex] += conversionValue[j] * oldNumber[i];
        }

        // increment the conversion value to the conversion for the next digit
        conversionValue = multiply(newBase, conversionValue, oldBaseTen);
    }
    
    // Flatten number to the new base
    for (int i = newNumber.size()-1; i >=0; i--) {
        if (newNumber[i] >= newBase) {
            newNumber[i-1] += newNumber[i]/newBase;
            newNumber[i] = newNumber[i]%newBase;
        }
    }

    // Trim and return the number
    return trimNumber(newNumber);
}