// Mock the DOM elements used in the functions
document.body.innerHTML = `
  <div class="search-bar">
    <input type="text" id="searchInput" value="" />
  </div>
  <div id="filterPopup" style="display: none;"></div>
  <input type="range" id="priceRangeMin" value="0" />
  <input type="range" id="priceRangeMax" value="1000" />
  <input type="range" id="distanceRange" value="50" />
  <input type="text" id="zipCode" value="" />
  <span id="priceRangeValue"></span>
  <span id="distanceRangeValue"></span>
`;

// Import the functions to test
const { handleSearch, toggleFilter, updatePriceRange, updateDistanceRange, applyFilters } = require('./index1.js');

// Mock localStorage
global.localStorage = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = value.toString();
  },
  clear() {
    this.store = {};
  },
};

describe('handleSearch', () => {
  test('should redirect to results.html when "tylenol" is searched', () => {
    document.getElementById('searchInput').value = 'tylenol';
    global.window = { location: { href: '' } };

    handleSearch();

    expect(localStorage.getItem('searchQuery')).toBe('tylenol');
    expect(global.window.location.href).toBe('results.html');
  });

  test('should redirect to ireslt.html when "ibuprofen" is searched', () => {
    document.getElementById('searchInput').value = 'ibuprofen';
    global.window = { location: { href: '' } };

    handleSearch();

    expect(localStorage.getItem('searchQuery')).toBe('ibuprofen');
    expect(global.window.location.href).toBe('ireslt.html');
  });

  test('should alert when an invalid search query is entered', () => {
    document.getElementById('searchInput').value = 'invalid';
    global.alert = jest.fn();

    handleSearch();

    expect(global.alert).toHaveBeenCalledWith('Please enter a valid medicine name or code.');
  });
});

describe('toggleFilter', () => {
  test('should toggle the filter popup visibility', () => {
    const filterPopup = document.getElementById('filterPopup');

    toggleFilter();
    expect(filterPopup.style.display).toBe('block');

    toggleFilter();
    expect(filterPopup.style.display).toBe('none');
  });
});

describe('updatePriceRange', () => {
  test('should update the price range display', () => {
    document.getElementById('priceRangeMin').value = '10';
    document.getElementById('priceRangeMax').value = '500';

    updatePriceRange();

    expect(document.getElementById('priceRangeValue').textContent).toBe('$10 - $500');
  });
});

describe('updateDistanceRange', () => {
  test('should update the distance range display', () => {
    updateDistanceRange('75');

    expect(document.getElementById('distanceRangeValue').textContent).toBe('75');
  });
});

describe('applyFilters', () => {
  test('should save the ZIP code to localStorage and alert the user', () => {
    document.getElementById('zipCode').value = '98004';
    global.alert = jest.fn();

    applyFilters();

    expect(localStorage.getItem('zipCode')).toBe('98004');
    expect(global.alert).toHaveBeenCalledWith(
      'Filters applied:\nPrice: $0 - $1000\nDistance: 50 miles\nZIP Code: 98004'
    );
  });
});