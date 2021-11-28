//Link for the API
const API = "https://lernia-sjj-assignments.vercel.app/api/challenges";

//	When the page is loaded then the funtion will run 
document.addEventListener("DOMContentLoaded", function (event) {

	//button that on click will show the challenges 
	let showFilterChallenges = document.querySelector("#show-filter-challenges"),

	// X that on click will hide the challenges box 
		hideFilterChallenges = document.querySelector("#hide-filter-challenges"),
		//Object that has Funtion SET will allow to store unique values inside 
		distinctTags = new Set();

	//changing the attribute hide 	
	showFilterChallenges.addEventListener("click", function (event) {
		document.querySelector("#filter-challenges").classList.remove("hidden");
	}, false);
	//changing the attribute hide 
	hideFilterChallenges.addEventListener("click", function (event) {
		document.querySelector("#filter-challenges").classList.add("hidden");
	}, false);

	//selecting input range > to Array >loop forEach 
	Array.from(document.querySelectorAll(".rating > input[type='range']")).forEach(function (input) {
		input.addEventListener("change", function (event) {
			console.log(input.name, input.value);
			input.previousElementSibling.style.setProperty("width", `${+input.value * 18}px`);
		}, false);
		input.dispatchEvent(new Event('change'));
	});
//Funtion Fetch to Get Data from API that gets a response (promise)
	fetch(API, {
		"method": "GET",
		"mode": "cors",
	}).then(function (response) {
		//if the response is Ok THEN > convert to json and run a funtion 
		if (response.ok) {
			response.json().then(function (data) {
				let cardList = document.querySelector('#challenges > .card-list');
				//loop that will go through every challenge object > loop inside label array 
				data.challenges.forEach(function (challenge) {
					challenge.labels.forEach(function (label) {
						//adding labes in the Object distinctTags > the labels will only be stored Once 
						distinctTags.add(label);
					});
					//Show all the data in order > += will store new elements into the cardlist everytime
					//data- tags will be stored with and space beetween 
					//the title will be shown with on- 
					//there is and image of empthy stars behind an image of full stars > the width of the stars are 90px > only the rating * 18 will be shown  
					cardList.innerHTML += `
						<li class="card" data-rating="${challenge.rating}" data-type="${challenge.type}" data-tags="${challenge.labels.join(' ')}">

							<div class="image" style="background-image: url('${challenge.image}')"></div>

							<div class="content">
								<div class="title" title="${challenge.title} (${challenge.type.replace("on", "on-")})">${challenge.title} (${challenge.type.replace("on", "on-")})</div>
								<div class="rating">
									<span><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i></span>
									<span style="width: ${challenge.rating * 18}px"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></span>

									${challenge.minParticipants}-${challenge.maxParticipants} participants
								</div>
								<div class="description">${challenge.description}</div>
							</div>
							<button class="primary on-white">Book this room</button>
						</li>
					`;
				});

				function filter (event) {
					
					//If we want to select atributes we will write something like document.querySlectorAll('[data-type:"online"]');
					//Then we will have all the attributes 
					//Types[] are declare to stored elements online and onsite in one Nodelist > both will have the same attribute name 
					//filter will retrn an array with the checked types > the one (or both) that is selected by the user
					//map will return an array with the value of the selected type 
					//join will add all the elemnts inside the array and separate them with (,) into a String
					//similarly to the types the tags has a similar funtion > the diference is ~= which mean that in that element will contain the selected tag in, is not reduced to = tag because a card can have many tags  

					let byType = Array.from(document.forms['filter-challenges'].elements['types[]']).filter(function (input) { return input.checked }).map(function (input) { return `[data-type="${input.value}"]`; }).join(),
						byTags = Array.from(document.forms['filter-challenges'].elements['tags[]']).filter(function (input) { return input.checked }).map(function (input) { return `[data-tags~="${input.value}"]`; }).join(),
						maxRanting = +document.forms['filter-challenges'].elements['maximum'].value,
						minRanting = +document.forms['filter-challenges'].elements['minimum'].value,
						keywords = document.forms['filter-challenges'].elements['keywords'].value.trim(),
						pattern = new RegExp(keywords.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig'),
						count = 0;

					//we select all the cards > iterate-loop > evaluate if they fullfill the condition then >they are shown 
					Array.from(document.querySelectorAll('#challenges .card')).forEach(function (card) {
						let rating = +card.dataset['rating'],
							title = card.querySelector(".title").textContent,
							description = card.querySelector(".description").textContent;
						if (
							byType.length > 0 &&
							byTags.length > 0 &&
							card.matches(byType) &&
							card.matches(byTags) &&
							rating >= minRanting && rating <= maxRanting &&
							(
								keywords.length == 0 ||
								pattern.test(title) ||
								pattern.test(description)
							)
						) {
							card.classList.remove("hidden");
							++count;
						} else {
							card.classList.add("hidden");
						}
					});
					if (count > 0) {
						document.querySelector("#challenges > h2").classList.add("hidden");
					} else {
						document.querySelector("#challenges > h2").classList.remove("hidden");
					}
				}
				document.forms['filter-challenges'].elements['keywords'].addEventListener("keyup", filter, false);
                let filterByTags = document.querySelector("#filter-by-tags");
	
				distinctTags.forEach(function (tag) {
					let input = document.createElement("input");
					input.addEventListener("change", filter, false);
					input.setAttribute("id", `tag-${tag}`);
					input.setAttribute("checked", "checked");
					input.setAttribute("class", "hidden");
					input.setAttribute("name", "tags[]");
					input.setAttribute("type", "checkbox");
					input.setAttribute("value", tag);
					filterByTags.append(input);
					filterByTags.innerHTML += `<label class="chip" for="tag-${tag}">${tag}</label>`;
				});
				Array.from(document.forms['filter-challenges'].elements).forEach(function (input) {
					input.addEventListener("change", filter, false);
				});
			}).catch(function (error) {
				console.error(error);
			});
		}
	}).catch(function (error) {
		console.error(error);
	});
}, false);