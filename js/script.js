
let valid = [0, 0, 0, 0, 0, 0];

$(document).ready(function () {

    fetchData(`search.php?s=`, `all`);

    //*_____________________ Nav animation open $ close______________________*/
    $("#closebar").hide();
    $('#openbar').on("click", function () {

        $('#sidebar').animate({ left: '0px' }, 500);
        $(this).hide();
        $("#closebar").show();

        $(".linkto").eq(0).animate({ top: 0 }, 500);
        $(".linkto").eq(1).animate({ top: 0 }, 600);
        $(".linkto").eq(2).animate({ top: 0 }, 700);
        $(".linkto").eq(3).animate({ top: 0 }, 800);
        $(".linkto").eq(4).animate({ top: 0 }, 900);



    });
    $("#closebar").on("click", function () {
        close();
    });
    //^_____________________ end _____________________*/

    //*_____________________ Nav links actions ______________________*/

    $('#mealSearch').on('click', function () {
        $('#meals').empty();
        $('#searchInputs').removeClass('d-none');
        $('#Contact').addClass('d-none');
        showmeals();
        close();
    });

    $('#searchByName').on('input keydown', function () {
        $('.loader').css('z-index','9');
        let searchValue = $(this).val();
        fetchData(`search.php?s=${searchValue}`, `Search`);

    });
    $('#searchByFLetter').on('input', function () {
        $('.loader').css('z-index','9');
        let searchValue = $(this).val();
        if (searchValue)
            fetchData(`search.php?f=${searchValue}`, `Search`);
        else
            fetchData(`search.php?s=`, `Search`);

    });

    $('#mealsCategories').on('click', function () {
        $('.loader').css('z-index','9');
        fetchData(`categories.php`, `Categories`);
        $('#searchInputs').addClass('d-none');
        $('#Contact').addClass('d-none');
        showmeals();

    });

    $('#mealsArea').on('click', function () {
        $('.loader').css('z-index','9');
        fetchData(`list.php?a=list`, `Area`);
        $('#searchInputs').addClass('d-none');
        $('#Contact').addClass('d-none');
        showmeals();
    });

    $('#mealsIngredients').on('click', function () {
        $('.loader').css('z-index','9');
        fetchData(`list.php?i=list`, `Ingredients`);
        $('#searchInputs').addClass('d-none');
        $('#Contact').addClass('d-none');
        showmeals();
    });

    $('#Contact-Us').on('click', function () {
        $('#Search').addClass('d-none');
        $('#Contact').removeClass('d-none');
        close();

    });
    //^_____________________ end Nav Links ______________________*/

    //* ______________________ Regex ______________________ */

    $('#name').on('input', function () {
        let regex = /^[a-zA-Z]+$/;
        if (regex.test($(this).val())) {
            $('#nameAlert').addClass('d-none');
            valid[0] = 1;
            checkValidation();
        }
        else {
            $('#nameAlert').removeClass('d-none');
            valid[0] = 0;
            checkValidation();
        }
    });

    $('#email').on('input', function () {
        let regex = /^[A-Za-z0-9._+-]+@[A-Za-z0-9-]+[.][A-Za-z.]{2,}$/;
        if (regex.test($(this).val())) {
            $('#emailAlert').addClass('d-none');
            valid[1] = 1;

            checkValidation();
        }

        else {
            $('#emailAlert').removeClass('d-none');
            valid[1] = 0;

            checkValidation();
        }
    });

    $('#phone').on('input', function () {
        let regex = /^[0-9]{10,12}$/;

        if (regex.test($(this).val())) {
            $('#phoneAlert').addClass('d-none');
            valid[2] = 1;

            checkValidation();
        }

        else {
            $('#phoneAlert').removeClass('d-none');
            valid[2] = 0;

            checkValidation();
        }


    });

    $('#age').on('input', function () {
        let regex = /^([1-9]|[1-9][1-9])$/;
        if (regex.test($(this).val())) {
            $('#ageAlert').addClass('d-none');
            valid[3] = 1;
            checkValidation();
        }
        else {
            $('#ageAlert').removeClass('d-none');
            valid[3] = 0;
            checkValidation();
        }

    });

    $('#password').on('input', function () {
        let regex = /^(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$/;
        if (regex.test($(this).val())) {
            $('#passwordAlert').addClass('d-none');
            valid[4] = 1;
            checkValidation();
        }
        else {
            $('#passwordAlert').removeClass('d-none');
            valid[4] = 0;
            checkValidation();
        }


    });

    $('#repassword').on('input', function () {
        let regex = $('#password').val();
        if ($(this).val() == regex) {
            $('#repasswordAlert').addClass('d-none');
            valid[5] = 1;
            checkValidation();
        }
        else {
            $('#repasswordAlert').removeClass('d-none');
            valid[5] = 0;
            checkValidation();
        }


    });
    //^_____________________ end Regex______________________*/


});

// ************************** Functions **********************************/
// & ========== function to fetch Data 

async function fetchData(data, type) {
    $('.loader').removeClass('d-none');
    $('body').addClass('overflow-hidden');

    const basehUrl = "https://www.themealdb.com/api/json/v1/1/";
    const response = await fetch(`${basehUrl}${data}`);

    if (response.status == 400) return;
    const result = await response.json();
    $('.loader').addClass('d-none');
    $('body').removeClass('overflow-hidden');
    display(result, type);
    close();


}

// & ========== function colse nav 
function close() {
    $("#sidebar").animate({ left: `${- $('#side').innerWidth()}px` }, 500);
    $('#closebar').hide();
    $("#openbar").show();
    $(".linkto").animate({ top: $("#navList").outerHeight(true) }, 500);
}

// & ========== function to call other displayed functions
function display(dataResult, type) {
    if (type == `Categories`) {
        displayCategory(dataResult)
    }
    else if (type == `all` || type == `Search`) {
        displayData(dataResult);
    }
    else if (type == `Area`) {
        displayAreas(dataResult);
    }
    else if (type == `Ingredients`) {
        displayIngredients(dataResult);
    }
    else if (type == `Details`) {
        displayDetails(dataResult);

    }

}

// & ========== function to display data
function displayData(dataList) {

    let meals = ``;
    let length = dataList.meals.length;
    if (dataList.meals == null) { $('#meals').html(`${meals}`); }
    else {
        if (length > 20)
            length = 20;
        for (let i = 0; i < length; i++) {
            meals += `<div class="col-md-3">
                        <figure class="figure position-relative overflow-hidden rounded-2" id="${dataList.meals[i].idMeal}" onclick="showDetails(${dataList.meals[i].idMeal})">
                            <img src="${dataList.meals[i].strMealThumb}" class="w-100 bg-secondary rounded-2" alt="meal photo" id="mealimg">
                            <figcaption
                                class="  ps-2 rounded-2 fs-3 text-center d-flex align-items-center justify-content-start" id="mealName">
                                <h3>${dataList.meals[i].strMeal}</h3>
                                </figcaption>
    
                        </figure>
                    </div>`;

        }
        $('#meals').html(`${meals}`);
    }

}

// & ========== function to display Categories
function displayCategory(dataList) {
    // console.log((dataList.categories[0].strCategoryDescription.split(" ")).slice(0, 7).join(" "));
    let meals = ``;
    for (let i = 0; i < dataList.categories.length; i++) {
        meals += `<div class="col-md-3">
                    <figure class=" position-relative overflow-hidden rounded-2" id="${dataList.categories[i].idCategory}" onclick="fetchData('filter.php?c=${dataList.categories[i].strCategory}', 'all');">
                        <img src="${dataList.categories[i].strCategoryThumb}" class="w-100  rounded-2" alt="meal photo" id="mealimg">
                        <figcaption
                            class=" p-2 rounded-2 text-center " id="mealName">
                            <h3 class="">${dataList.categories[i].strCategory}</h3>
                            <p>${(dataList.categories[i].strCategoryDescription.split(" ")).slice(0, 20).join(' ')}</p>
                        </figcaption>

                    </figure>
                </div>`

    }
    $('#meals').html(`${meals}`);
}

// & ========== function to display areas
function displayAreas(dataList) {

    let meals = `<div class="row gy-4" id="meals">`;
    for (let i = 0; i < dataList.meals.length; i++) {
        meals += ` 
        <div class="col-md-3 text-center area" onclick="fetchData('filter.php?a=${dataList.meals[i].strArea}', 'all');">
                   <i class="fa-solid fa-house-laptop fa-4x gray "></i>
                    <h3 class="gray">${dataList.meals[i].strArea}</h3>
                </div>
                `;

    }
    meals += `</div>`
    $('#cont').html(`${meals}`);

    $(".gray").css("color", "#f9f6f6");
}

// & ========== function to display Ingredients
function displayIngredients(dataList) {

    let meals = `<div class="row gy-4" id="meals">`;
    for (let i = 0; i < 20; i++) {
        meals += ` 
        <div class=" ingred col-md-3 text-center overflow-hidden" onclick="fetchData('filter.php?i=${dataList.meals[i].strIngredient}', 'all');" >
                   <i class="fa-solid fa-drumstick-bite fa-4x gray "></i>
                    <h3 class="gray">${dataList.meals[i].strIngredient}</h3>
                    <p class="gray">${(dataList.meals[i].strDescription.split(" ")).slice(0, 20).join(' ')}</p>
        </div>
                `;

    }
    meals += `</div>`
    $('#cont').html(`${meals}`);

    $(".gray").css("color", "#f9f6f6");
}

//*==================== Details =================*//
// & ========== function to display meal details
function displayDetails(data) {
    
    let ingredients = ``
    for (let i = 1; i <= 20; i++) {
        var element = `strIngredient${i}`;
        let ingred = data.meals[0][element];
        element = `strMeasure${i}`;
        let measure = data.meals[0][element];

        if (ingred) {
            ingredients += `<span class="alert alert-info p-1 me-3">${measure} ${ingred}</span>`
        }

    }

    let details = `<div class="row text-white">
                    <div class="col-md-4">
                        <img src="${data.meals[0].strMealThumb}" class="w-100 rounded-2" alt="meal image" >
                        <h2>${data.meals[0].strMeal}</h2>
                    </div>
                    <div class="col-md-8">
                        <h2 id="title">Instructions</h2>
                        <p>${data.meals[0].strInstructions}</p>
                        <h3>Area <span class="">: ${data.meals[0].strArea}</span></h3>
                        <h3>Category <span class="">: ${data.meals[0].strCategory}</span></h3>
                        
                        <h3>Recipes :</h3>
                        <div id="Recipes" class="d-flex flex-wrap ms-2 mt-3"></div>
                        <h3 class="my-4">Tags :</h3>
                        <span class="alert alert-danger py-1 px-1  ms-2 " id="Tag"></span>
                        <div class="btns mt-3">
                            <a class="btn btn-success" href="${data.meals[0].strSource}" target="_blank"> Source </a>
                            <a class="btn btn-danger" href="${data.meals[0].strYoutube}" target="_blank"> You Tube </a>
                        </div>
                       
                    </div>
                </div>`;

    $('#mealDetail').html(details);
    $('#Recipes').html(ingredients);



    if (data.meals[0].strTags != null) {
        $('#Tag').html(data.meals[0].strTags);
    }
    else
        $('#Tag').addClass('d-none');
}

// & ========== function to display details Section
function showDetails(id) {
    $('.loader').css('z-index','9');
    $('#detailSection').removeClass('d-none');
    $('#Search').addClass('d-none');
    fetchData(`lookup.php?i=${id}`, `Details`);

}

// & ========== function to display meals Section
function showmeals() {
    $('#detailSection').addClass('d-none');
    $('#Search').removeClass('d-none');
}

//*==================== Contact Us Section =================*//

// & ========== function to check Validation
function checkValidation() {
    let exist = valid.indexOf(0);
    if (exist == -1) {
        $('#submitbtn').prop('disabled', false);
    }
    else {
        $('#submitbtn').prop('disabled', true);
    }

}