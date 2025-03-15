// reusable autocomplete function

// will accept a 'config object' with custom functions to control the autocomplete behavior
const createAutoComplete = ({
    root,
    renderOption,
    onOptionSelect,
    inputValue,
    fetchData
}) => {

    // inject autocomplete input + bulma dropdown structure into root html
    root.innerHTML = `
        <label><b>Search</b></label>
        <input class="input"/>
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results"></div>
            </div>
        </div>
    `;

    // grab necessary elements from inside root
    const input = root.querySelector('input');
    const dropdown = root.querySelector('dropdown');
    const resultsWrapper = root.querySelector('.results');

    // attach debounce to input change
    const onInput = async event => {
        // fetch data based on user input
        const items = await fetchData(event.target.value);

        // if no matching results, close dropdown + return early
        if (!items.length) {
            dropdown.classList.remove('is-active');
            return;
        }

        // clear previous search results before displaying new ones;
        resultsWrapper.innerHTML = '';
        dropdown.classList.add('is-active'); // open dropdown with new results

        // loop through each fetched item + create 'a' option in dropdown
        for (let item of items) {
            const option = document.createElement('a');

            // add bulma dropdown item styling
            option.classList.add('dropdown-item');

            // call renderOption func from config to inject html for item
            option.innerHTML = renderOption(item);

            // handle click of dropdown item selected
            option.addEventListener('click', () => {
                dropdown.classList.add('is-active');

                // set input value based on selection
                input.value = inputValue(item);

                // call onOptionSelect func from config to handle chosen item
            });
        }
    }
}