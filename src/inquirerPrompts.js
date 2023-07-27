const inquirer = require('inquirer');

exports.initPrompt = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                // Add more choices based on requirements
            ],
        },
    ]);
};
// Add more prompts based on requirements
