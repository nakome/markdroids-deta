export default function handleToggleMenu(evt) {
    evt.preventDefault();
    const btn = evt.target;
    const list = btn.nextElementSibling;

    btn.classList.toggle("is-dropdown-open")
    list.classList.toggle("dropdown-open");

    list.querySelectorAll('button').forEach(el => {
        el.addEventListener("click", toggleMenu);
    });

    function toggleMenu(evt) {
        evt.preventDefault();
        btn.classList.remove("is-dropdown-open");
        list.classList.remove("dropdown-open");
    }
}
