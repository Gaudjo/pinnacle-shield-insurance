//Adds functionality for selecting one of the insurance cards
document.addEventListener('DOMContentLoaded', function() {
    const insuranceTypes = document.querySelectorAll('.insuranceType');
    const forms = {
        auto: document.getElementById('autoForm'),
        home: document.getElementById('homeForm'),
        life: document.getElementById('lifeForm')
    };

 //Figures out which card is selected and un-hides the corresponding form 
    insuranceTypes.forEach(card => {
        card.addEventListener('click', function() {
            const type = this.dataset.type;
            const radio = this.querySelector('input[type="radio"]');

            // Unselect all cards
            insuranceTypes.forEach(c => c.classList.remove('selected'));
            // Hide all forms
            Object.values(forms).forEach(f => f.style.display = 'none');

            // Select this card
            this.classList.add('selected');
            radio.checked = true;

            // Show corresponding form
            forms[type].style.display = 'block';
            
            // Clear previous validation errors when switching forms
            clearAllErrors();
        });
    });
    
    // Add form submission handlers for each insurance type
    const autoForm = document.getElementById('autoQuoteForm');
    const homeForm = document.getElementById('homeQuoteForm');
    const lifeForm = document.getElementById('lifeQuoteForm');

    [autoForm, homeForm, lifeForm].forEach(formElement => {
        if (formElement) {
            formElement.addEventListener('submit', function(e) {
                console.log('Form submitted:', formElement.id);
                e.preventDefault();
                const selectedType = document.querySelector('input[name="insuranceType"]:checked');
                console.log('Selected type:', selectedType ? selectedType.value : 'none');
                if (selectedType && selectedType.value === formElement.id.replace('QuoteForm', '')) {
                    console.log('Validating form for:', selectedType.value);
                    if (validateForm(selectedType.value)) {
                        console.log('Form valid, calculating quote');
                        calculateQuoteType(selectedType.value);
                    } else {
                        console.log('Form invalid');
                    }
                } else {
                    console.log('Type mismatch or no type selected');
                }
            });
        }
    });
    
    // Add real-time validation on field changes
    const allFields = document.querySelectorAll('input[type="text"], input[type="number"], select');
    allFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        field.addEventListener('change', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });



const results = document.getElementById('results');
const validationSummary = document.getElementById('validationSummary');

const currentYear = new Date().getFullYear();
const vehicleYearInput = document.getElementById('vehicleYear');

//sets the multipliers for each plan choice in the quote calculation
const planMultipliers = {
    Basic: 0.8,
    Standard: 1.0,
    Premium: 1.4
};

//Form Field Validation
const fieldRules = {
    autoFullName: {label: 'Full Name', required: true, minLength: 2, maxLength: 35, pattern: /^[a-zA-Z .'-]+$/},
    homeFullName: {label: 'Full Name', required: true, minLength: 2, maxLength: 35, pattern: /^[a-zA-Z .'-]+$/},
    lifeFullName: {label: 'Full Name', required: true, minLength: 2, maxLength: 35, pattern: /^[a-zA-Z .'-]+$/},
    autoAge: {label: 'Age', required: true, min: 16, max: 100 },
    homeAge: {label: 'Age', required: true, min: 16, max: 100 },
    lifeAge: {label: 'Age', required: true, min: 16, max: 100 },
    autoZipCode: {label: 'ZIP Code', required: true, pattern: /^\d{5}$/ },
    homeZipCode: {label: 'ZIP Code', required: true, pattern: /^\d{5}$/ },
    lifeZipCode: {label: 'ZIP Code', required: true, pattern: /^\d{5}$/ },
    vehicleYear: {label: 'Vehicle Year', required: true, min: 1990, max: 2026},
    vehicleMake: {label: 'Vehicle Make', required: true},
    vehicleModel: {label: 'Vehicle Model', required: true, minLength: 1, pattern: /^[a-zA-Z0-9 .'-]+$/},
    annualMileage: {label: 'Annual Mileage', required: true},
    drivingRecord: {label: 'Driving Record', required: true},
    coverageLevel: {label: 'Coverage Level', required: true},
    homeValue: {label: 'Home Value', required: true, min: 50000},
    yearBuilt: {label: 'Year Built', required: true, min: 1900, max: 2026},
    squareFootage: {label: 'Square Footage', required: true, min: 500, max: 10000},
    constructionType: {label: 'Construction Type', required: true},
    sprinklerSys: {label: 'Fire Sprinkler System', required: false},
    securitySys: {label: 'Security System', required: false},
    gender: {label: 'Gender', required: true},
    smoker: {label: 'Smoker Status', required: true},
    coverageAmount: {label: 'Coverage Amount', required: true},
    exercise: {label: 'Exercise Frequency', required: true},
    preExist: {label: 'Pre-existing Conditions', required: false}
};

const commonFields = ['coverageLevel'];
const autoSpecificFields = ['autoFullName','autoAge','autoZipCode','vehicleYear', 'vehicleMake', 'vehicleModel', 'annualMileage', 'drivingRecord'];
const homeSpecificFields = ['homeFullName','homeAge','homeZipCode','homeValue', 'yearBuilt', 'squareFootage','constructionType', 'securitySys', 'sprinklerSys'];
const lifeSpecificFields = ['lifeFullName','lifeAge','lifeZipCode','gender', 'smoker', 'coverageAmount', 'exercise', 'preExist'];

//const commdonFields = ['fullName', 'age', 'zipCode', 'coverageLevel'];

// Map field names to their form control IDs
const fieldNameToIds = {
    autoFullName: 'autoFullName',
    homeFullName: 'homeFullName',
    lifeFullName: 'lifeFullName',
    autoAge: 'autoAge', 
    homeAge: 'homeAge',
    lifeAge: 'lifeAge',
    autoZipCode: 'autoZipCode',
    homeZipCode: 'homeZipCode',
    lifeZipCode: 'lifeZipCode',
    coverageLevel: 'coverageLevel',
    vehicleYear: 'vehicleYear',
    vehicleMake: 'vehicleMake',
    vehicleModel: 'vehicleModel',
    annualMileage: 'annualMileage',
    drivingRecord: 'drivingRecord',
    homeValue: 'homeValue',
    yearBuilt: 'yearBuilt',
    squareFootage: 'squareFootage',
    constructionType: 'constructionType',
    securitySys: 'securitySys',
    sprinklerSys: 'sprinklerSys',
    gender: 'gender',
    smoker: 'smoker', // This is a radio button group
    coverageAmount: 'coverageAmount',
    exercise: 'exercise',
    preExist: 'pre-exist'
};

//Validate a single form field
function validateField(field) {
    const fieldId = field.id;
    const rules = fieldRules[fieldId];
    
    if (!rules) return true;
    
    const isValid = checkFieldValidity(field, rules);
    
    if (isValid) {
        clearFieldError(field);
    } else {
        setFieldError(field, getErrorMessage(field, rules));
    }
    
    return isValid;
}


// Validate a radio button group
 
function validateRadioGroup(groupName) {
    const radioGroup = document.querySelectorAll(`input[name="${groupName}"]`);
    const isChecked = Array.from(radioGroup).some(radio => radio.checked);
    
    if (!isChecked) {
        // Add error class to all radios in group
        radioGroup.forEach(radio => {
            radio.classList.add('error');
            // Find the parent div and add error class
            const parentDiv = radio.closest('.mb-3') || radio.closest('div');
            if (parentDiv) {
                parentDiv.classList.add('error');
            }
        });
        return false;
    } else {
        // Remove error class
        radioGroup.forEach(radio => {
            radio.classList.remove('error');
            const parentDiv = radio.closest('.mb-3') || radio.closest('div');
            if (parentDiv) {
                parentDiv.classList.remove('error');
            }
        });
        return true;
    }
}

/**
 * Check if a field is valid based on its rules
 */
function checkFieldValidity(field, rules) {
    const value = field.value.trim();
    
    // Check required
    if (rules.required && !value) {
        return false;
    }
    
    // If not required and empty, it's valid
    if (!rules.required && !value) {
        return true;
    }
    
    // Check minLength
    if (rules.minLength && value.length < rules.minLength) {
        return false;
    }
    
    // Check maxLength
    if (rules.maxLength && value.length > rules.maxLength) {
        return false;
    }
    
    // Check pattern (regex)
    if (rules.pattern && !rules.pattern.test(value)) {
        return false;
    }
    
    // Check min value (for numbers)
    if (rules.min !== undefined) {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue < rules.min) {
            return false;
        }
    }
    
    // Check max value (for numbers)
    if (rules.max !== undefined) {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue > rules.max) {
            return false;
        }
    }
    
    return true;
}


 // Get appropriate error message for a field
 
function getErrorMessage(field, rules) {
    const value = field.value.trim();
    const label = rules.label || field.id;
    
    if (rules.required && !value) {
        return `${label} is required`;
    }
    
    if (rules.minLength && value.length < rules.minLength) {
        return `${label} must be at least ${rules.minLength} characters`;
    }
    
    if (rules.maxLength && value.length > rules.maxLength) {
        return `${label} must not exceed ${rules.maxLength} characters`;
    }
    
    if (rules.pattern && value && !rules.pattern.test(value)) {
        if (field.id === 'autoZipCode') {
            return `${label} must be a valid 5-digit ZIP code`;
        }
        if (field.id === 'homeZipCode') {
            return `${label} must be a valid 5-digit ZIP code`;
        }
        if (field.id === 'lifeZipCode') {
            return `${label} must be a valid 5-digit ZIP code`;
        }
        return `${label} contains invalid characters`;
    }
    
    if (rules.min !== undefined) {
        const numValue = parseFloat(value);
        if (numValue < rules.min) {
            return `${label} must be at least ${rules.min}`;
        }
    }
    
    if (rules.max !== undefined) {
        const numValue = parseFloat(value);
        if (numValue > rules.max) {
            return `${label} cannot exceed ${rules.max}`;
        }
    }
    
    return `${label} is invalid`;
}


 // Mark a field as having an error
function setFieldError(field, errorMessage) {
    // Add error class to field
    field.classList.add('error');
    
    // Remove existing error message if any
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create and insert error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = errorMessage;
    field.parentElement.appendChild(errorDiv);
}


 // Clear error state from a field
 
function clearFieldError(field) {
    field.classList.remove('error');
    
    // Remove error message
    const errorDiv = field.parentElement.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Clear all validation errors from the form

function clearAllErrors() {
    // Clear regular field errors
    const errorFields = document.querySelectorAll('.form-control.error, select.error');
    errorFields.forEach(field => {
        clearFieldError(field);
    });
    
    // Clear radio button errors
    const errorRadios = document.querySelectorAll('input[type="radio"].error, input[type="checkbox"].error');
    errorRadios.forEach(radio => {
        radio.classList.remove('error');
        const parentDiv = radio.closest('.mb-3') || radio.closest('div');
        if (parentDiv) {
            parentDiv.classList.remove('error');
        }
    });
    
    const summary = document.getElementById('validationSummary');
    if (summary) {
        summary.classList.add('hidden');
        summary.innerHTML = '';
    }
}


 // Validate all fields in the active form
function validateForm(insuranceType) {
    clearAllErrors();
    
    const errors = [];
    const fieldsToValidate = getFieldsForType(insuranceType);
    
    // Validate each field
    fieldsToValidate.forEach(fieldName => {
        const rules = fieldRules[fieldName];
        
        // Handle radio button groups specially
        if (fieldName === 'coverageLevel' || fieldName === 'smoker') {
            const radioGroupName = fieldName === 'smoker' ? 'smoker' : insuranceType + 'coverageLevel';
            if (!validateRadioGroup(radioGroupName)) {
                errors.push(rules.label + ' is required');
            }
        } else {
            // Map field name to actual ID
            const fieldId = fieldNameToIds[fieldName];
            const field = document.getElementById(fieldId);
            
            if (!field) return;
            
            // Regular field validation
            if (!validateField(field)) {
                errors.push(rules.label);
            }
        }
    });
    
    // Display validation summary if there are errors
    if (errors.length > 0) {
        displayValidationSummary(errors);
        return false;
    }
    
    // Form is valid - you can now submit it or process the data
    console.log('Form is valid for', insuranceType);
    return true;
}


// Get list of fields to validate based on insurance type
function getFieldsForType(insuranceType) {
    let fields = [commonFields];
    
    switch(insuranceType) {
        case 'auto':
            fields = fields.concat(autoSpecificFields);
            break;
        case 'home':
            fields = fields.concat(homeSpecificFields);
            break;
        case 'life':
            fields = fields.concat(lifeSpecificFields);
            break;
    }
    
    return fields;
}

//---------------------------INSURANCE QUOTE CALCULATIONS---------------------------------------------------


 // Figures out which form has been selected and then calls the correct calculation function

function calculateQuoteType(insuranceType) {
    let result = {};
    
    switch(insuranceType) {
        case 'auto':
            result = calculateAutoPremium();
            break;
        case 'home':
            result = calculateHomePremium();
            break;
        case 'life':
            result = calculateLifePremium();
            break;
        default:
            console.error('Unknown insurance type:', insuranceType);
            return;
    }
    
    const quoteType = displayQuote(result, insuranceType);
}

/**
 * Calculate auto insurance quote
 */
function calculateAutoPremium() {
    // Base rate for auto insurance
    let baseRate = 75; // Monthly base rate
    
    // Get form values
    const age = parseInt(document.getElementById('autoAge').value);
    const vehicleYear = parseInt(document.getElementById('vehicleYear').value);
    const annualMileage = document.getElementById('annualMileage').value;
    const drivingRecord = document.getElementById('drivingRecord').value;
    const coverageLevel = document.querySelector('input[name="autoCoverageLevel"]:checked').value;
    
    
    // Age multiplier
    let ageFactor = 1.0;
    let ageDescription = "Standard rate";
    if (age < 25) {
        ageFactor = 1.5;
        ageDescription = "Young driver surcharge (under 25)";
    } else if (age > 65) {
        ageFactor = 1.3;
        ageDescription = "Senior driver adjustment (over 65)";
    }
    
    // Vehicle age
    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - vehicleYear;
    let vehicleAgeFactor = 1.0;
    let vehicleAgeDescription = "Standard vehicle age";
    if (vehicleAge <= 2) {
        vehicleAgeFactor = 1.3;
        vehicleAgeDescription = "New vehicle surcharge";
    } else if (vehicleAge > 10) {
        vehicleAgeFactor = 0.8;
        vehicleAgeDescription = "Older vehicle discount";
    }
    
    // Annual mileage
    let mileageFactor = 1.0;
    let mileageDescription = "Standard mileage";
    switch(annualMileage) {
        case 'under5000':
            mileageFactor = 0.8;
            mileageDescription = "Low mileage discount";
            mileText = 'Under 5,000';
            break;
        case '5000-10000':
            mileageFactor = 1.0;
            mileageDescription = "Standard mileage";
            mileText = "5,000-10,000";
            break;
        case '10,001-15000':
            mileageFactor = 1.1;
            mileageDescription = "Moderate mileage surcharge";
            mileText = "10,001-15,000";
            break;
        case '15001-20000':
            mileageFactor = 1.3;
            mileageDescription = "High mileage surcharge";
            mileText = "15,001-20,000";
            break;
        case 'over20000':
            mileageFactor = 1.5;
            mileageDescription = "Very high mileage surcharge";
            mileText = "Over 20,000";
            break;
    }
    
    // Driving record multiplier
    let recordMultiplier = 1.0;
    let recordDescription = "Clean record";
    switch(drivingRecord) {
        case 'clean':
            recordMultiplier = 1.0;
            recordDescription = "Clean Record";
            ticketText = "Clean";
            break;

        case '1ticket':
            recordMultiplier = 1.2;
            recordDescription = "One traffic ticket";
            ticketText = "1 Ticket";
            break;
        case '2+tickets':
            recordMultiplier = 1.5;
            recordDescription = "Multiple traffic tickets";

            break;
        case 'accident':
            recordMultiplier = 1.8;
            recordDescription = "Recent accident penalty ";
            break;
    }
    
    // Coverage level multiplier
    let coverageMultiplier = 1.0;
    let coverageDescription = "Standard coverage";
    let coverageText = "Plan Choice: Standard";
    switch(coverageLevel) {
        case 'basic':
            coverageMultiplier = 0.8;
            coverageDescription = "Basic coverage discount";
            coverageText = "Plan Choice: Basic";
            break;
        case 'premium':
            coverageMultiplier = 1.4;
            coverageDescription = "Premium coverage surcharge";
            coverageText = "Plan: Choice: Premium";
            break;
    }
    
    // Calculate final monthly premium
    const monthlyPremium = baseRate * ageFactor * vehicleAgeFactor * 
        mileageFactor * recordMultiplier * coverageMultiplier;
    
    // Create array from user input for the breakdown table summary
    const breakdown = [
        { factor: "Base Rate", userInput: "$75/month", impact: "$Starting rate" },

        { factor: "Age", userInput: `${age} years`, impact: `${ageDescription}(x${ageFactor})` },

        { factor: "Vehicle Age", userInput: `${vehicleYear} (${vehicleAge} years old)`, impact: `${vehicleAgeDescription} (x${vehicleAgeFactor})`},

        { factor: "Annual Mileage", userInput: `${mileText}` , impact: `${mileageDescription} (x${mileageFactor})` },

        { factor: "Driving Record", userInput: `${ticketText}` , impact: `${recordDescription} (x${recordMultiplier})` },

        { factor: "Coverage Level", userInput: `${coverageText}`, impact: `${coverageDescription} (x${coverageMultiplier})` }
    ];
    
    return {
        monthlyPremium: Math.round(monthlyPremium),
        annualPremium: Math.round(monthlyPremium * 12),
        breakdown: breakdown
    };
}

/**
 * Calculate home insurance quote
 */
function calculateHomePremium() {
    // Get form values
    const homeValue = parseFloat(document.getElementById('homeValue').value);
    const yearBuilt = parseInt(document.getElementById('yearBuilt').value);
    const squareFootage = parseInt(document.getElementById('squareFootage').value);
    const constructionType = document.getElementById('constructionType').value;
    const hasSprinkler = document.getElementById('sprinklerSys').checked;
    const hasSecurity = document.getElementById('securitySys').checked;
    const coverageLevel = document.querySelector('input[name="homeCoverageLevel"]:checked').value;
    
    // Base rate (monthly)
    const baseRate = (homeValue * 0.003) / 12;
    
    // Year Built Factor
    const currentYear = new Date().getFullYear();
    const homeAge = currentYear - yearBuilt;
    let builtFactor = 1.0;
    let builtDescription = "Standard age home";
    if  (homeAge <= 26) {
        builtFactor = 1.0;
        builtDescription = "Standard age home";
    } else if (homeAge < 50) {
        builtFactor = 1.2;
        builtDescription = "Older home surcharge";
    } else {
        builtFactor = 1.4;
        builtDescription = "Very old home surcharge";
    }
    
    // Size Factor
    let sizeFactor = (homeValue * 0.01) / 12;
    let sizeDescription = "Per square foot"

    
    // Construction Factor
    let constructionFactor = 1.0;
    let constructionDescription = "Standard construction";
    switch(constructionType) {
        case 'wood':
            constructionFactor = 1.2;
            constructionDescription = "Wood frame (higher fire risk)";
            constructText = "Wood";
            break;
        case 'brick':
            constructionFactor = 1.0;
            constructionDescription = "Brick construction (lower risk)";
            constructText = "Brick";
            break;
        case 'concrete':
            constructionFactor = 0.9;
            constructionDescription = "Concrete construction (lowest risk)";
            constructText = "Concrete";
            break;
        case 'steel':
            constructionFactor = 0.85;
            constructionDescription = "Steel construction (very low risk)";
            constructText = "Steel";
            break;
    }
    
    // Safety features discounts
    let safetyDiscount = 1.0;
    let safetyDescription = "No impact";
    let safetyText = "No safety features";
    if (hasSprinkler && hasSecurity) {
        safetyDiscount = 0.874; // 12.6% total discount (8% + 5% - some overlap)
        safetyDescription = "Extra safe bonus";
        safetyText = "Has sprinkler and security Systems";
    } else if (hasSprinkler) {
        safetyDiscount = 0.92;
        safetyDescription = "Fire sprinkler system";
        safetyText = "Has fire sprinkler system";
    } else if (hasSecurity) {
        safetyDiscount = 0.95;
        safetyDescription = "Security system";
        safetyText = "Has security system";
    }
    
    // Coverage level multiplier
    let coverageMultiplier = 1.0;
    let coverageDescription = "Standard coverage";
    let coverageText = "Plan Choice: Standard";
    switch(coverageLevel) {
        case 'basic':
            coverageMultiplier = 0.8;
            coverageDescription = "Basic coverage discount";
            coverageText = "Plan Choice: Basic";
            break;
        case 'premium':
            coverageMultiplier = 1.4;
            coverageDescription = "Premium coverage surcharge";
            coverageText = "Plan Choice: Premium";
            break;
    }
    
    // Calculate monthly premium
    const monthlyPremium = baseRate * builtFactor * sizeFactor * constructionFactor * 
        safetyDiscount * coverageMultiplier;
    
    // Create breakdown array
    const breakdown = [
        { factor: "Base Rate", userInput:`${homeValue}` , impact: `Based on Home Value: (x${baseRate})` },

        { factor: "Home Age", userInput: `${yearBuilt} (${homeAge} years old)`, impact: `${builtDescription} (x${builtFactor})` },

        { factor: "Home Size", userInput: `${squareFootage}`, impact: `Based on SquareFootage: (x${baseRate})`},

        { factor: "Construction Type", userInput: `${constructText}`, impact: `${constructionDescription} (x${constructionFactor})` },

        { factor: "Safety Features", userInput: `${safetyText}` , impact: `${safetyDescription} (x${safetyDiscount})`},

        { factor: "Coverage Level", userInput: `${coverageText}`, impact: `${coverageDescription} (x${coverageMultiplier})` }
    ];
    
    return {
        monthlyPremium: Math.round(monthlyPremium),
        annualPremium: Math.round(monthlyPremium * 12),
        breakdown: breakdown
    };
}

/**
 * Calculate life insurance quote
 */
function calculateLifePremium() {
    // Get form values
    const age = parseInt(document.getElementById('lifeAge').value);
    const gender = document.getElementById('gender').value;
    const isSmoker = document.querySelector('input[name="smoker"]:checked').value === 'yes';
    const coverageAmount = parseInt(document.getElementById('coverageAmount').value);
    const exercise = document.getElementById('exercise').value;
    const hasPreExisting = document.getElementById('pre-exist').checked;
    const coverageLevel = document.querySelector('input[name="lifeCoverageLevel"]:checked').value;
    
    // Base rate (monthly)
    let baseMonthlyRate = (coverageAmount * 0.0005) / 12
    baseMonthlyRate: Math.round(baseMonthlyRate)
    
    // Age Factor
    let ageFactor = 1.0;
    let ageDescription = "Standard age rate";
    if (age < 30) {
        ageFactor = 1.0;
        ageDescription = "Standard age rate";
    } else if (age < 45) {
        ageFactor = 1.5;
        ageDescription = "Middle age rate";
    } else if (age < 60) {
        ageFactor = 2.5;
        ageDescription = "Senior surcharge";
    } else {
        ageFactor = 4.0;
        ageDescription = "End of life surcharge";
    }
    
    // Gender Factor
    let genderFactor = 1.0;
    let genderDescription = "Standard rate";
    switch(gender) {
        case 'male':
            genderFactor = 1.1;
            genderDescription = "Male";
            genderText = "Male"
            break;
        case 'female':
            genderFactor = 1.0;
            genderDescription = "Female";
            break; 
        case 'nonbinary':
            genderFactor = 1.05;
            genderDescription = "Non-binary";
            break;   
    }
    
    // Smoking multiplier
    let smokingMultiplier = 1.0;
    let smokingDescription = "Non-smoker";
    let smokeFeed = "";
    if (isSmoker) {
        smokingMultiplier = 2.0;
        smokingDescription = "Smoker";
        smokeFeed = "Smoker Penalty";
    }
    
    // Exercise frequency
    let exerciseMultiplier = 1.0;
    let exerciseDescription = "Standard activity level";
    switch(exercise) {
        case 'rarely':
            exerciseMultiplier = 1.3;
            exerciseDescription = "Sedentary lifestyle surcharge";
            exerText = "Rarely";
            break;
        case '1-2times':
            exerciseMultiplier = 1.2;
            exerciseDescription = "Light exercise";
            exerText = "1 - 2 times a week";
            break;
        case '3-4times':
            exerciseMultiplier = 1.0;
            exerciseDescription = "Standard activity level";
            exerText = "3 - 4 times a week";
            break;
        case '5times':
            exerciseMultiplier = 0.9;
            exerciseDescription = "Active lifestyle discount";
            exerText = "5+ times a week";
            break;
    }
    
    // Pre-existing conditions multiplier
    let healthMultiplier = 1.0;
    let healthDescription = "No pre-existing conditions";
    let healthAnswer = "No";
    if (hasPreExisting) {
        healthMultiplier = 1.5;
        healthDescription = "Pre-existing conditions surcharge";
        healthAnswer = "Yes";
    }
    
    // Coverage level multiplier
    let coverageMultiplier = 1.0;
    let coverageDescription = "Standard coverage";
    let coverageText = "Plan Choice: Standard";
    switch(coverageLevel) {
        case 'basic':
            coverageMultiplier = 0.8;
            coverageDescription = "Basic coverage discount";
            coverageText = "Plan Choice: Basic";
            break;
        case 'premium':
            coverageMultiplier = 1.4;
            coverageDescription = "Premium coverage surcharge";
            coverageText = "Plan Choice: Premium";
            break;
    }
    
    // Calculate monthly premium
    const monthlyPremium = baseMonthlyRate * ageFactor * genderFactor * smokingMultiplier * 
                          exerciseMultiplier * healthMultiplier * coverageMultiplier;
    
    // Create breakdown array
    const breakdown = [
        { factor: "Base Rate (set by coverage amount)", userInput: `${coverageAmount}`, impact: `Base Monthly Rate: (x${baseMonthlyRate})`},

        { factor: "Age", userInput: `${age} years`, impact: `${ageDescription} (x${ageFactor})` },

        { factor: "Gender", userInput: `${genderText}`, impact: `(${genderFactor})`},

        { factor: "Smoking Status", userInput: `${smokingDescription}`, impact: `${smokeFeed} (x${smokingMultiplier})`},

        { factor: "Exercise Frequency", userInput: `${exerText}`, impact: `${exerciseDescription} (x${exerciseMultiplier})`},

        { factor: "Health History", userInput: `${healthAnswer}`, impact: `${healthDescription} (x${healthMultiplier})`},

        { factor: "Coverage Level", userInput: `${coverageText}`, impact: `${coverageDescription} (x${coverageMultiplier})`}
    ];
    
    return {
        monthlyPremium: Math.round(monthlyPremium),
        annualPremium: Math.round(monthlyPremium * 12),
        breakdown: breakdown
    };
}

function displayQuote(result, insuranceType) {
    premiumSummary.classList.remove('hidden');
    console.log('Displaying quote:', result, insuranceType);
    // Get user name based on insurance type
    let userName = '';
    switch(insuranceType) {
        case 'auto':
            userName = document.getElementById('autoFullName').value.trim();
            break;
        case 'home':
            userName = document.getElementById('homeFullName').value.trim();
            break;
        case 'life':
            userName = document.getElementById('lifeFullName').value.trim();
            break;
    }

    const displayBox = document.getElementById('displayBox');
    displayBox.innerHTML = `
        <h3>${userName || 'Customer'}</h3>
        <p>Estimated Monthly Premium: $${result.monthlyPremium}</p>
        <p>Estimated Annual Premium: $${result.annualPremium}</p>
    `;

    // Populate the breakdown table
    const tbody = document.querySelector('#premiumSummary tbody');
    tbody.innerHTML = ''; // Clear existing rows

    if (result.breakdown && result.breakdown.length > 0) {
        result.breakdown.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.factor}</td>
                <td>${item.userInput}</td>
                <td>${item.impact}</td>
            `;
            tbody.appendChild(row);
        });
    }
}

});