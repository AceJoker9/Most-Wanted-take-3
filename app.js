function app(people) {
    displayWelcome();
    runSearchAndMenu(people);
    return exitOrRestart(people);
}

function displayWelcome() {
    alert('Hello and welcome to the Most Wanted search application!');
}

function runSearchAndMenu(people) {
    const searchResults = searchPeopleDataSet(people);

    if (searchResults.length > 1) {
        displayPeople('Search Results', searchResults);
    }
    else if (searchResults.length === 1) {
        const person = searchResults[0];
        mainMenu(person, people);
    }
    else {
        alert('No one was found in the search.');
    }
}



function searchPeopleDataSet(people) {

    const searchTypeChoice = validatedPrompt(
        'Please enter in what type of search you would like to perform.',
        ['id', 'name', 'traits']
    );

    let results = [];
    switch (searchTypeChoice) {
        case 'id':
            results = searchById(people);
            break;
        case 'name':
            results = searchByName(people);
            break;
        case 'traits':
            
            results = searchByTraits(people);
            break;
        default:
            return searchPeopleDataSet(people);
    }

    
}
    if (results.length === 0) {
        alert('No results found.');
        return [];
    }

    const resultNames = results.map((person) => '${person.firstName} , ${person.lastName}');
    const selectedResultIndex = validatedPrompt('Please select a person:', resultNames) - 1;
    const selectedPerson = results[selectedResultIndex];



    const actionChoices = ['Display immediate family members', 'Display descendants'];
    const actionChoice = validatedPrompt('Please select an action:', actionChoices);

    if(actionChoice === 'Display immediate family members') {
        const immediateFamily = people.filter((person) => {
            return person.currentSpouse === selectedPerson.id ||
            person.parents.includes(selectedPerson.id) ||
            selectedPerson.parents.includes(person.id) ||
            (person.id !== selectedPerson.id && person.parents.some((parent) => selectedPerson.parents.includes(parent))) 
        });

        const immediateFamilyNames = immediateFamily.map ((person) => {
            let relation;
            if (person.currentSpouse === selectedPerson.id) {
                relation ='Spouse';
            } else if (person.parents.includes(selectedPerson.id)) {
                relation = person.gender === 'male' ? 'Father' : 'Mother';
            } else if (selectedPerson.parents.includes(person.id)) {
                relation = person.gender === 'male' ? 'Son' : 'Daughter';
            } else {
                relation = 'Sibling';
            }
            return '${person.firstName} ${person.lastName} (${relation})';
        });

        if (immediateFamilyNames.length === 0) {
            alert('No immediate family members found.');
        } else {
            const message ="Immediate family members:\n${immediateFamilyNames.join('\n')}";
            alert(message);
        }

        return [selectedPerson];

        }
     else if (actionChoice === 'Display descendants') {
        const descendants =[];

        function findDescendants(person) {
            people.forEach((candidate) => {
                if (candidate.parents.includes(person.id)) {
                    descendants.push(candidate);
                    findDescendants(candidate);
                }
            });
        }

        findDescendants(selectedPerson);

        if (descendants.length === 0) {
            alert('No descendants found.');
        } else {
            const descendantsNames = descendants.map((person) => '${person.firstName} ${person.lastName}');
            const message = 'Decendants:\n${descendantNames.join(\n)}';
            alert(message);
        }
    }

    return [selectedPerson];




    
   








function formatPerson(person) {
    return '${person.firstName} ${person.lastName}, ${person.gender}, DOB:${person.dob}, Height: ${person.height} inches, Weight: ${person.weigiht} lbs, Eye Color: ${person.eyeColor}, Occupation: ${person.occupation}';
}


function searchByTraits(people) {
    let searchCriteria = [];

    // prompt the user to enter search criteria
    while (searchCriteria.length < 5) {
        const trait = validatedPrompt(
            'Please enter a trait to search for.',
            ['gender', 'dob', 'height', 'weight', 'eyeColor', 'occupation']
        );

        const value = prompt('Please enter the value to search for.');
        searchCriteria.push({trait, value });

        const continueSearch = validatedPrompt('Would you like to add another search criteria? (y/n)').toLowerCase();
        if (continueSearch !== 'y') {
            break;
        }
    }

    // Search for people based on the search criteria
        let results = people;
        for (const {trait, value } of searchCriteria) {
            results = results.filter(person => person[trait] === value);
        if (results.length === 1) {// only one person left, no need to contune searching
            break;
        }

        }


            //Display search results
        if (results.length === 0) {
        alert('No matching records found.');
    } else if (results.length === 1) {
        alert('Found one matching record:\n\n${formatPerson(results[0])}');
    } else {
        const formattedResults = results.map(formatPerson).join('\n\n');
        alert('Found ${results.length} matching records: \n\n${formattedResults}');
}


    return results;
        
    }



function searchById(people) {
    const idToSearchForString = prompt('Please enter the id of the person you are searching for.');
    const idToSearchForInt = parseInt(idToSearchForString);
    const idFilterResults = people.filter(person => person.id === idToSearchForInt);
    return idFilterResults;
}

function searchByName(people) {
    const firstNameToSearchFor = prompt('Please enter the the first name of the person you are searching for.');
    const lastNameToSearchFor = prompt('Please enter the the last name of the person you are searching for.');
    const fullNameSearchResults = people.filter(person => (person.firstName.toLowerCase() === firstNameToSearchFor.toLowerCase() && person.lastName.toLowerCase() === lastNameToSearchFor.toLowerCase()));
    return fullNameSearchResults;
}

function mainMenu(person, people) {

    const mainMenuUserActionChoice = validatedPrompt(
        `Person: ${person.firstName} ${person.lastName}\n\nDo you want to know their full information, family, or descendants?`,
        ['info', 'family', 'descendants', 'quit']
    );

    switch (mainMenuUserActionChoice) {
        case "info":
            
        displayPersonInfo(person);
            break;


        case "family":
            
             let personFamily = findPersonFamily(person, people);
             displayPeople('Family', personFamily);
            break;
        case "descendants":
            
             let personDescendants = findPersonDescendants(person, people);
             displayPeople('Descendants', personDescendants);
            break;

    

        case "research":
            let searchCriteria = prompt('Enter search criteria:');
            let outcome = searchPeople(searchCriteria, people);
            while (results.length > 1) {
                searchCriteria = prompt('Multiple matching people found (${results.length}). \nEnter additional search criteria to filter further:');
                outcome = searchPeople(searchCriteria, outcome);
            }
            if (outcome.length === 1) {
                displayPersonInfo(outcome[0]);
            } else {
                alert('No mathcing people found.');
            }
            break;
            
            case "quit":
            return;
        default:
            alert('Invalid input. Please try again.');
            
    }

    return mainMenu(person, people);
}

function findPersonDescendants(person, people) {
    let descendants = [];
    if (person.children.length === 0) {
        return descendants;
    }
    const children = people.filter(p => person.children.includes(p.id));
    descendants.push(...children);
    children.forEach(child => {
        descendants.push(...findPersonDescendants(child, people));
    });
    return descendants;
}


function searchPeople(criteria, people) {
    const traits = criteria.split('');
    let results = people;
    traits.forEach(trait => {
        const [key,value] = triat.split(':');
        results = results.filter(p => p[key] === value);
    });
    return results;
}





function findPersonFamily(person, people) {
    let family = [];
    if (person.currentSpouse) {
        const spouse =  people.find(p => p.id === person.currentSpouse);
        family.push({name: '${spouse.firstName} ${spouse.lastName}', relaton: 'Spouse'});
    }
    if (person.parents.length > 0) {
        const parents = people.filter(p => person.parents.includes(p.id));
        parents.forEach(parent => {
            const relation = parent.gender === 'male' ? 'Father' : 'Mother';
            family.push({name: '${parent.firstName} ${parent.lastName}', relation: relation});
        });
    }
    if (person.parents.length === 0) {
        const Siblings = people.filter(p => p.id !== person.id && p.parents.length > 0 && p.parents.some(id => person.parents.includes(id)));
        Siblings.forEach(sibling => {
            const relation = sibling.gender === 'male' ? 'Brother' : 'Sister';
            family.push({name: '${sibling.firstName} ${sibling.lastName}', relation: relation});
        });
    }
    return family;

}



function displayPeople(displayTitle, peopleToDisplay) {
    const formatedPeopleDisplayText = peopleToDisplay.map(person => `${person.firstName} ${person.lastName}`).join('\n');
    alert(`${displayTitle}\n\n${formatedPeopleDisplayText}`);
}

function validatedPrompt(message, acceptableAnswers) {
    acceptableAnswers = acceptableAnswers.map(aa => aa.toLowerCase());

    const builtPromptWithAcceptableAnswers = `${message} \nAcceptable Answers: ${acceptableAnswers.map(aa => `\n-> ${aa}`).join('')}`;

    const userResponse = prompt(builtPromptWithAcceptableAnswers).toLowerCase();

    if (acceptableAnswers.includes(userResponse)) {
        return userResponse;
    }
    else {
        alert(`"${userResponse}" is not an acceptable response. The acceptable responses include:\n${acceptableAnswers.map(aa => `\n-> ${aa}`).join('')} \n\nPlease try again.`);
        return validatedPrompt(message, acceptableAnswers);
    }
}

function exitOrRestart(people) {
    const userExitOrRestartChoice = validatedPrompt(
        'Would you like to exit or restart?',
        ['exit', 'restart']
    );

    switch (userExitOrRestartChoice) {
        case 'exit':
            return;
        case 'restart':
            return app(people);
        default:
            alert('Invalid input. Please try again.');
            return exitOrRestart(people);
    }

}