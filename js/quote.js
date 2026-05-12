document.addEventListener('DOMContentLoaded', function() {
    const insuranceTypes = document.querySelectorAll('.insuranceType');
    const forms = {
        auto: document.getElementById('autoForm'),
        home: document.getElementById('homeForm'),
        life: document.getElementById('lifeForm')
    };

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
        });
    });
});