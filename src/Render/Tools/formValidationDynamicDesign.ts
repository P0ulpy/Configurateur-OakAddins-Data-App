(function(): void
{
    // for form design
    window.addEventListener('DOMContentLoaded', () => 
    {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        const forms = document.querySelectorAll('.needs-validation')

        // Loop over them and prevent submission
        for(const form of Array.prototype.slice.call(forms) as HTMLFormElement[])
        {
            form.addEventListener('submit', (event) => 
            {
                if (!form.checkValidity()) 
                {
                    event.preventDefault();
                    event.stopPropagation();
                }

                form.classList.add('was-validated');

            }, false)
        }
    });
})();