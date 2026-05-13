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
    }
    
    displayQuote(result, insuranceType);
}

/**
 * Calculate auto insurance quote
 */
function calculateAutoPremium() {
    // Base rate for auto insurance
    let baseRate = 75; // Monthly base rate
    
    // Get form values
    const age = parseInt(document.getElementById('age').value);
    const vehicleYear = parseInt(document.getElementById('vehicleYear').value);
    const annualMileage = document.getElementById('annualMileage').value;
    const drivingRecord = document.getElementById('drivingRecord').value;
    const coverageLevel = document.querySelector('input[name="coverageLevel"]:checked').value;
    
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
            break;
        case '5000-10000':
            mileageFactor = 1.0;
            mileageDescription = "Standard mileage";
            break;
        case '10,001-15000':
            mileageFactor = 1.1;
            mileageDescription = "Moderate mileage surcharge";
            break;
        case '15001-20000':
            mileageFactor = 1.3;
            mileageDescription = "High mileage surcharge";
            break;
        case 'over20000':
            mileageFactor = 1.5;
            mileageDescription = "Very high mileage surcharge";
            break;
    }
    
    // Driving record multiplier
    let recordMultiplier = 1.0;
    let recordDescription = "Clean record";
    switch(drivingRecord) {
        case '1ticket':
            recordMultiplier = 1.2;
            recordDescription = "One traffic ticket";
            break;
        case '2+tickets':
            recordMultiplier = 1.5;
            recordDescription = "Multiple traffic tickets";
            break;
        case 'accident':
            recordMultiplier = 1.8;
            recordDescription = "Recent accident";
            break;
    }
    
    // Coverage level multiplier
    let coverageMultiplier = 1.0;
    let coverageDescription = "Standard coverage";
    switch(coverageLevel) {
        case 'basic':
            coverageMultiplier = 0.8;
            coverageDescription = "Basic coverage discount";
            break;
        case 'premium':
            coverageMultiplier = 1.4;
            coverageDescription = "Premium coverage surcharge";
            break;
    }
    
    // Calculate final monthly premium
    const monthlyPremium = baseRate * ageFactor * vehicleAgeFactor * 
        mileageFactor * recordMultiplier * coverageMultiplier;
    
    // Create breakdown array
    const breakdown = [
        { factor: "Base Rate", userInput: "$75/month", impact: "$Starting rate" },

        { factor: "Age", userInput: `${age} years`,
            impact: ageFactor === 1.0 ? "No change" : `${(ageFactor * 100 - 100).toFixed(0)}% 
            ${ageFactor > 1 ? 'increase' : 'decrease'}` },

        { factor: "Vehicle Age", userInput: `${vehicleYear} (${vehicleAge} years old)`, 
            impact: vehicleAgeFactor === 1.0 ? "No change" : `${(vehicleAgeFactor * 100 - 100).toFixed(0)}% 
            ${vehicleAgeFactor > 1 ? 'increase' : 'decrease'}` },

        { factor: "Annual Mileage", userInput: annualMileage.replace(/(\d)/g, '$1,').replace('under5000', 'Under 5,000')
            .replace('5000-10000', '5,000-10,000').replace('10,001-15000', '10,001-15,000')
            .replace('15001-20000', '15,001-20,000').replace('over20000', 'Over 20,000'), 
            impact: mileageFactor === 1.0 ? "No change" : `${(mileageFactor * 100 - 100).toFixed(0)}% 
            ${mileageFactor > 1 ? 'increase' : 'decrease'}` },

        { factor: "Driving Record", userInput: drivingRecord.charAt(0).toUpperCase() 
            + drivingRecord.slice(1).replace('1ticket', '1 Ticket').replace('2+tickets', '2+ Tickets')
            .replace('accident', 'Accident'), impact: recordMultiplier === 1.0 ? "No change" : 
            `${(recordMultiplier * 100 - 100).toFixed(0)}% increase` },

        { factor: "Coverage Level", userInput: coverageLevel.charAt(0).toUpperCase() 
            + coverageLevel.slice(1), impact: coverageMultiplier === 1.0 ? "No change" : 
            `${Math.abs(coverageMultiplier * 100 - 100).toFixed(0)}% ${coverageMultiplier > 1 ? 
            'increase' : 'decrease'}` }
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
    const coverageLevel = document.querySelector('input[name="coverageLevel"]:checked').value;
    
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
    let sizeDescription = "Per square foot: + $0.01/month"

    
    // Construction Factor
    let constructionFactor = 1.0;
    let constructionDescription = "Standard construction";
    switch(constructionType) {
        case 'wood':
            constructionFactor = 1.2;
            constructionDescription = "Wood frame (higher fire risk)";
            break;
        case 'brick':
            constructionFactor = 1.0;
            constructionDescription = "Brick construction (lower risk)";
            break;
        case 'concrete':
            constructionFactor = 0.9;
            constructionDescription = "Concrete construction (lowest risk)";
            break;
        case 'steel':
            constructionFactor = 0.85;
            constructionDescription = "Steel construction (very low risk)";
            break;
    }
    
    // Safety features discounts
    let safetyDiscount = 1.0;
    let safetyDescription = "No impact";
    if (hasSprinkler && hasSecurity) {
        safetyDiscount = 0.874; // 12.6% total discount (8% + 5% - some overlap)
        safetyDescription = "Sprinkler & security system";
    } else if (hasSprinkler) {
        safetyDiscount = 0.92;
        safetyDescription = "Fire sprinkler system";
    } else if (hasSecurity) {
        safetyDiscount = 0.95;
        safetyDescription = "Security system";
    }
    
    // Coverage level multiplier
    let coverageMultiplier = 1.0;
    let coverageDescription = "Standard coverage";
    switch(coverageLevel) {
        case 'basic':
            coverageMultiplier = 0.8;
            coverageDescription = "Basic coverage discount";
            break;
        case 'premium':
            coverageMultiplier = 1.4;
            coverageDescription = "Premium coverage surcharge";
            break;
    }
    
    // Calculate monthly premium
    const monthlyPremium = baseRate * builtFactor * sizeFactor * constructionFactor * 
        safetyDiscount * coverageMultiplier;
    
    // Create breakdown array
    const breakdown = [
        { factor: "Base Rate", userInput: `0.35% of $${homeValue.toLocaleString()}`, impact: `$${(baseRate).toFixed(2)}
            /month` },

        { factor: "Home Age", userInput: `${yearBuilt} (${homeAge} years old)`, 
            impact: builtFactor === 1.0 ? "No change" : `${Math.abs(builtFactor * 100 - 100).toFixed(0)}% 
            ${builtFactor > 1 ? 'increase' : 'decrease'}` },

        { factor: "Home Size", userInput: `${squareFootage.toLocaleString()} sq ft`, 
            impact: sizeFactor === 1.0 ? "No change" : `${(sizeFactor * 100 - 100).toFixed(0)}% 
            ${sizeFactor > 1 ? 'increase' : 'decrease'}` },

        { factor: "Construction Type", userInput: constructionType.charAt(0).toUpperCase() + 
            constructionType.slice(1), impact: constructionFactor === 1.0 ? "No change" : 
            `${Math.abs(constructionFactor * 100 - 100).toFixed(0)}% ${constructionFactor > 1 ? 
                'increase' : 'decrease'}` },

        { factor: "Safety Features", userInput: safetyDescription, impact: safetyDiscount === 1.0 ? 
            "No change" : `${Math.abs((1 - safetyDiscount) * 100).toFixed(1)}% decrease` },

        { factor: "Coverage Level", userInput: coverageLevel.charAt(0).toUpperCase() 
            + coverageLevel.slice(1), impact: coverageMultiplier === 1.0 ? "No change" : 
            `${Math.abs(coverageMultiplier * 100 - 100).toFixed(0)}% ${coverageMultiplier > 1 ? 
                'increase' : 'decrease'}` }
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
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const isSmoker = document.querySelector('input[name="smoker"]:checked').value === 'yes';
    const coverageAmount = parseInt(document.getElementById('coverageAmount').value);
    const exercise = document.getElementById('exercise').value;
    const hasPreExisting = document.getElementById('pre-exist').checked;
    const coverageLevel = document.querySelector('input[name="coverageLevel"]:checked').value;
    
    // Base rate (monthly)
    const baseMonthlyRate = (coverageAmount * 0.0005) / 12
    
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
    if (isSmoker) {
        smokingMultiplier = 2.0;
        smokingDescription = "Smoker";
    }
    
    // Exercise frequency
    let exerciseMultiplier = 1.0;
    let exerciseDescription = "Standard activity level";
    switch(exercise) {
        case 'rarely':
            exerciseMultiplier = 1.3;
            exerciseDescription = "Sedentary lifestyle surcharge";
            break;
        case '1-2times':
            exerciseMultiplier = 1.2;
            exerciseDescription = "Light exercise";
            break;
        case '3-4times':
            exerciseMultiplier = 1.0;
            exerciseDescription = "Standard activity level";
            break;
        case '5times':
            exerciseMultiplier = 0.9;
            exerciseDescription = "Active lifestyle discount";
            break;
    }
    
    // Pre-existing conditions multiplier
    let healthMultiplier = 1.0;
    let healthDescription = "No pre-existing conditions";
    if (hasPreExisting) {
        healthMultiplier = 1.5;
        healthDescription = "Pre-existing conditions surcharge";
    }
    
    // Coverage level multiplier
    let coverageMultiplier = 1.0;
    let coverageDescription = "Standard coverage";
    switch(coverageLevel) {
        case 'basic':
            coverageMultiplier = 0.8;
            coverageDescription = "Basic coverage discount";
            break;
        case 'premium':
            coverageMultiplier = 1.4;
            coverageDescription = "Premium coverage surcharge";
            break;
    }
    
    // Calculate monthly premium
    const monthlyPremium = baseMonthlyRate * ageFactor * genderFactor * smokingMultiplier * 
                          exerciseMultiplier * healthMultiplier * coverageMultiplier;
    
    // Create breakdown array
    const breakdown = [
        { factor: "Base Rate", userInput: `$${baseRatePerThousand}/month per $1,000`, impact: 
            `$${(baseMonthlyRate).toFixed(2)}/month` },

        { factor: "Coverage Amount", userInput: `$${coverageAmount.toLocaleString()}`, 
            impact: "Sets base premium" },

        { factor: "Age", userInput: `${age} years`, impact: ageFactor === 1.0 ? 
            "No change" : `${Math.abs(ageFactor * 100 - 100).toFixed(0)}% ${ageFactor > 1 ? 
            'increase' : 'decrease'}` },

        { factor: "Gender", userInput: gender.charAt(0).toUpperCase() + gender.slice(1), 
            impact: genderFactor === 1.0 ? "No change" : `${Math.abs(genderFactor * 100 - 100).toFixed(0)}% 
            ${genderFactor > 1 ? 'increase' : 'decrease'}` },

        { factor: "Smoking Status", userInput: isSmoker ? "Smoker" : "Non-smoker", 
            impact: smokingMultiplier === 1.0 ? "No change" : `${(smokingMultiplier * 100 - 100).toFixed(0)}
            % increase` },

        { factor: "Exercise Frequency", userInput: exercise.replace('1-2times', '1-2 times/week')
            .replace('3-4times', '3-4 times/week').replace('5times', '5+ times/week').replace('rarely', 'Rarely'), 
            impact: exerciseMultiplier === 1.0 ? "No change" : `${Math.abs(exerciseMultiplier * 100 - 100).toFixed(0)}% 
            ${exerciseMultiplier > 1 ? 'increase' : 'decrease'}` },

        { factor: "Health History", userInput: hasPreExisting ? "Pre-existing conditions" : "No pre-existing conditions", 
            impact: healthMultiplier === 1.0 ? "No change" : `${(healthMultiplier * 100 - 100).toFixed(0)}% increase` },

        { factor: "Coverage Level", userInput: coverageLevel.charAt(0).toUpperCase() + coverageLevel.slice(1), 
            impact: coverageMultiplier === 1.0 ? "No change" : `${Math.abs(coverageMultiplier * 100 - 100).toFixed(0)}% 
            ${coverageMultiplier > 1 ? 'increase' : 'decrease'}` }
    ];
    
    return {
        monthlyPremium: Math.round(monthlyPremium),
        annualPremium: Math.round(monthlyPremium * 12),
        breakdown: breakdown
    };
}

function addBreakdownRow(breakdown, factor, userInput, impact) {
var row = document.createElement('tr');
row.textContent =
'<td>' + factor + '</td>' +
'<td>' + userValue + '</td>' +
'<td>' + impact + '</td>';
tbody.appendChild(row);
}