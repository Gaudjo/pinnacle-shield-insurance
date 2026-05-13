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
    
    // Add form submission handlers
    const form = document.querySelector('form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const selectedType = document.querySelector('input[name="insuranceType"]:checked');
        if (selectedType) {
            if (validateForm(selectedType.value)) {
                calculateQuote(selectedType.value);
            }
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
    fullName: {label: 'Full Name', required: true, minLength: 2, maxLength: 35, pattern: /^[a-zA-Z .'-]+$/},
    age: {label: 'Age', required: true, min: 16, max: 100 },
    zipCode: {label: 'ZIP Code', required: true, pattern: /^\d{5}$/ },
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

const commonFields = ['fullName', 'age', 'zipCode', 'coverageLevel'];
const autoSpecificFields = ['vehicleYear', 'vehicleMake', 'vehicleModel', 'annualMileage', 'drivingRecord'];
const homeSpecificFields = ['homeValue', 'yearBuilt', 'squareFootage','constructionType', 'securitySys', 'sprinklerSys'];
const lifeSpecificFields = ['gender', 'smoker', 'coverageAmount', 'exercise', 'preExist'];

// Map field names to their form control IDs
const fieldNameToIds = {
    fullName: 'fullName',
    age: 'age',
    zipCode: 'zipCode',
    coverageLevel: 'coverageLevel', // This is a radio button group
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

/**
 * Validate a radio button group
 */
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

/**
 * Get appropriate error message for a field
 */
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
        if (field.id === 'zipCode') {
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

/**
 * Mark a field as having an error
 */
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

/**
 * Clear error state from a field
 */
function clearFieldError(field) {
    field.classList.remove('error');
    
    // Remove error message
    const errorDiv = field.parentElement.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

/**
 * Clear all validation errors from the form
 */
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

/**
 * Validate all fields in the active form
 */
function validateForm(insuranceType) {
    clearAllErrors();
    
    const errors = [];
    const fieldsToValidate = getFieldsForType(insuranceType);
    
    // Validate each field
    fieldsToValidate.forEach(fieldName => {
        const rules = fieldRules[fieldName];
        
        // Handle radio button groups specially
        if (fieldName === 'coverageLevel' || fieldName === 'smoker') {
            const radioGroupName = fieldName === 'preExist' ? 'pre-exist' : fieldName;
            if (!validateRadioGroup(radioGroupName)) {
                errors.push(rules.label);
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

/**
 * Get list of fields to validate based on insurance type
 */
function getFieldsForType(insuranceType) {
    let fields = [...commonFields];
    
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

/**
 * Display validation summary with all errors
 */
function displayValidationSummary(errors) {
    const summary = document.getElementById('validationSummary');
    
    if (!summary) return;
    
    let html = '<strong>Please fix the following errors:</strong><ul>';
    errors.forEach(error => {
        html += `<li>${error}</li>`;
    });
    html += '</ul>';
    
    summary.innerHTML = html;
    summary.classList.remove('hidden');
    
    // Scroll to validation summary
    summary.scrollIntoView({ behavior: 'smooth', block: 'start' });
}





// INSURANCE QUOTE CALCULATION FUNCTIONS

/**
 * Main quote calculation function
 */
function calculateQuote(insuranceType) {
    let monthlyPremium = 0;
    
    switch(insuranceType) {
        case 'auto':
            quote = calculateAutoQuote();
            break;
        case 'home':
            quote = calculateHomeQuote();
            break;
        case 'life':
            quote = calculateLifeQuote();
            break;
        default:
            console.error('Unknown insurance type:', insuranceType);
            return;
    }
    
    displayQuote(quote, insuranceType);
}

/**
 * Calculate auto insurance quote
 */
function calculateAutoPremium() {
    // Base rate for auto insurance
    let baseRate = 75; // Annual base rate
    
    // Get form values
    const age = parseInt(document.getElementById('age').value);
    const vehicleYear = parseInt(document.getElementById('vehicleYear').value);
    const annualMileage = document.getElementById('annualMileage').value;
    const drivingRecord = document.getElementById('drivingRecord').value;
    const coverageLevel = document.querySelector('input[name="coverageLevel"]:checked').value;
    
    // Age multiplier
    let ageFactor = 1.0;
    if (age < 25) ageFactor = 1.5;
    else if (age < 65) ageFactor = 1.0;
    else if (age > 65) ageFactor = 1.3;
    
    // Vehicle age
    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - vehicleYear;
    let vehicleAgeFactor = 1.0;
    if (vehicleAge <= 2) vehicleAgeFactor = 1.3;
    else if (vehicleAge < 10) vehicleAgeFactor = 1.0;
    else vehicleAgeFactor = 0.8;
    
    // Annual mileage
    let mileageFactor = 1.0;
    switch(annualMileage) {
        case 'under5000':
            mileageFactor = 0.8;
            break;
        case '5000-10000':
            mileageFactor = 1.0;
            break;
        case '10,001-15000':
            mileageFactor = 1.1;
            break;
        case '15001-20000':
            mileageFactor = 1.3;
            break;
        case 'over20000':
            mileageFactor = 1.5;
            break;
    }
    
    // Driving record multiplier
    let recordMultiplier = 1.0;
    switch(drivingRecord) {
        case 'clean':
            recordMultiplier = 1.0;
            break;
        case '1ticket':
            recordMultiplier = 1.2;
            break;
        case '2+tickets':
            recordMultiplier = 1.5;
            break;
        case 'accident':
            recordMultiplier = 1.8;
            break;
    }
    
    // Coverage level multiplier
    let coverageMultiplier = 1.0;
    switch(coverageLevel) {
        case 'basic':
            coverageMultiplier = 0.8;
            break;
        case 'standard':
            coverageMultiplier = 1.0;
            break;
        case 'premium':
            coverageMultiplier = 1.4;
            break;
    }
    
    // Calculate final quote
    const autoMonthlyPremium = baseRate * ageFactor * vehicleAgeFactor * 
                  mileageFactor * recordMultiplier * coverageMultiplier;
    
    return Math.round(monthlyPremium);
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
    const coverageLevel = document.querySelector('input[name="coverageLevel"]:checked').value;
    
    // Base rate calculation
    let baseRate = homeValue * (0.003 / 12);
    
    // Year Built Factor
    const currentYear = new Date().getFullYear();
    const homeAge = currentYear - yearBuilt;
    let builtFactor = 1.0;
    if (homeAge <= 26) builtFactor = 1.0;
    else if (homeAge <= 56) builtFactor = 1.1;
    else builtFactor = 1.4;
    
    // Size Factor
    let sizeFactor = squareFootage * (0.01 / 12);

    
    // Construction Factor
    let constructionFactor = 1.0;
    switch(constructionType) {
        case 'wood':
            constructionFactor = 1.2;
            break;
        case 'brick':
            constructionFactor = 1.0; 
            break;
        case 'concrete':
            constructionFactor = 0.9;
            break;
        case 'steel':
            constructionFactor = 0.85;
            break;
    }
    
    // Safety features discounts
    let safetyDiscount = 1.0;
    if (hasSprinkler) safetyDiscount *= 0.92; // 8% discount for sprinkler
    if (hasSecurity) safetyDiscount *= 0.95; // 5% discount for security system
    
    // Coverage level multiplier
    let coverageMultiplier = 1.0;
    switch(coverageLevel) {
        case 'basic':
            coverageMultiplier = 0.8;
            break;
        case 'standard':
            coverageMultiplier = 1.0;
            break;
        case 'premium':
            coverageMultiplier = 1.4;
            break;
    }
    
    // Premium formula
    const monthlyPremium = baseRate * builtFactor * sizeFactor * constructionFactor * 
                  safetyDiscount * coverageMultiplier;
    
    return Math.round(monthlyPremium);
}

/**
 * Calculate life insurance quote
 */
function calculateLifePremium() {
    // Get form values
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const isSmoker = document.querySelector('input[name="smoker"]:checked').value === 'yes';
    const coverageAmount = parseInt(document.getElementById('coverageAmount').value);
    const exercise = document.getElementById('exercise').value;
    const hasPreExisting = document.getElementById('pre-exist').checked;
    const coverageLevel = document.querySelector('input[name="coverageLevel"]:checked').value;
    
    // Base rate
    let baseRate = coverageAmount * (0.0005 / 12)
    
    // Age Factor
    let ageFactor = 1.0;
    if (age < 30) ageFactor = 1.0;
    else if (age < 45) ageFactor = 1.5;
    else if (age < 60) ageMultiplier = 2.5;
    else if (age < 85) ageMultiplier = 4.0;

    // Gender Factor
   let genderFactor = 1.0;
   switch(gender) {
    case 'male':
        genderFactor = 1.1;
        break;
    case 'female':
        genderFactor = 1.0;
        break; 
    case 'nonbinary':
        genderFactor = 1.05;
        break;   
   }
    
    // Smoking multiplier
    let smokingMultiplier = isSmoker ? 2.0 : 1.0;
    
    // Exercise frequency
    let exerciseMultiplier = 1.0;
    switch(exercise) {
        case 'rarely':
            exerciseMultiplier = 1.4;
            break;
        case '1-2times':
            exerciseMultiplier = 1.1;
            break;
        case '3-4times':
            exerciseMultiplier = 0.9;
            break;
        case '5times':
            exerciseMultiplier = 0.8;
            break;
    }
    
    // Pre-existing conditions multiplier
    let healthMultiplier = hasPreExisting ? 1.5 : 1.0;
    
    // Coverage level multiplier
    let coverageMultiplier = 1.0;
    switch(coverageLevel) {
        case 'basic':
            coverageMultiplier = 0.8;
            break;
        case 'standard':
            coverageMultiplier = 1.0;
            break;
        case 'premium':
            coverageMultiplier = 1.4;
            break;
    }
    
    // Premium formula
    const monthlyPremium = baseRate * ageFactor * genderFactor * smokingMultiplier * 
                  exerciseMultiplier * healthMultiplier * coverageMultiplier;
    
    return Math.round(monthlyPremium);
}