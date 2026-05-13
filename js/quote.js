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
            validateForm(selectedType.value);
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
    sprinklerSys: {label: 'Fire Sprinkler System', required: true},
    securitySys: {label: 'Security System', required: true},
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

/**
 * Validate a single form field
 */
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