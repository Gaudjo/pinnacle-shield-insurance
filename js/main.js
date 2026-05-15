document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
 
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        var target = 

        document.querySelector(this.getAttribute('href'));

        if (target) {

            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

var searchInput = document.getElementById('faq-search');
if (searchInput) {
    searchInput.addEventListener('input', function() {
        var searchTerm = this.value.toLowerCase();
        var items = document.querySelectorAll('.accordion-item');

        items.forEach(function(item) {
            var text = item.textContent.toLowerCase();
            if (text.indexOf(searchTerm) !== -1) {
                item.style.display = '';
            }else {
                item.style.display = 'none';
            }
        });
    });
}