var visibleMonsers, newMonsters;
var pokemonsLimit, allLoaded = false;
var $masonryContainer;

$( document ).ready(function(){

	$('#show-next-pack-text').text('Hmmmm... Let me think.');
	document.getElementById('show-next-pack').style.pointerEvents = 'none';

	$('#pokedex').css('display','none');

	$masonryContainer = $('#pm-items-container');

	
	//mas
	$masonryContainer.masonry({
		itemSelector: '.grid-item',
		columnWidth: 145,
		gutter: 5,
		isFitWidth: true,
		itemSelector: '.grid-item',
		isResizable: true,
		transitionDuration: 0,
		opacity: 0,
  		transform: 'scale(0.001)'
	});

	$.ajax({
		url: "http://pokeapi.co/api/v1/pokemon/?limit=25&offset=0" //?limit=999
	}).then(function(data) {

		pokemonsLimit = data.meta.total_count;

		visibleMonsers = data;
		printPack(data.objects);
		preloadPack();

		console.log(data);

		$('#container').on('click', '.box', function(){
			$('#container').addClass('container-calc');
			$('#pokedex').addClass('opened_pkdx');
			$('#mobile-filter-membrane').css({
				'display':'block'
			});
			$masonryContainer.masonry('layout'); //mas
			$('#pokemons_image').css('background-image', $(this).find('.pokemon-image').css('background-image'));

			$('.chosenOne').removeClass('chosenOne');
			$(this).addClass('chosenOne');

			var temp = $(this).attr('id');
			temp = temp.replace('box', '');

			var result = $.grep(visibleMonsers.objects, function(e){ return e.pkdx_id == temp; });
			result = result[0];

			var number = result.pkdx_id;
			if (number < 10){
				number = '00'+number;
			}else if (number < 100){
				number = '0'+number;
			}

			var pokemonTypes='';

			result.types.forEach(function(e){
				pokemonTypes += e.name+' ';
			});

			$('html, body').animate({
				scrollTop: $('.chosenOne').offset().top - 50
			}, 300);

			$('#pokemons_info_text').html(result.name+' #'+number+'</br><span id="pokemon-types-list">Type: '+pokemonTypes+'</span><span class="pokemons_info_part">HP: '+result.hp+'</span><span class="pokemons_info_part">Weight: '+result.weight+'</span></br><span class="pokemons_info_part">Att: '+result.attack+'</span><span class="pokemons_info_part">Def: '+result.defense+'</span></br><span class="pokemons_info_part">SP Att: '+result.sp_atk+'</span><span class="pokemons_info_part">SP Def: '+result.sp_def+'</span></br><span class="pokemons_info_part">Speed: '+result.speed+'</span><span class="pokemons_info_part">Total moves: '+result.moves.length+'</span>' );
		});

		eventsInit();

		$('#loading').fadeOut( 200, "linear", function(){$('#loading').remove()});
		$('#pokedex').css('display','block');
	});
});

function eventsInit(){

$('.header-type').on('click', function(){
	$(this).toggleClass('hidden-type');
	var availableTypes = ['normal', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug', 'ghost', 'steel', 'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy', 'unknown', 'shadow'];
	var classList = this.className.split(/\s+/);
	var classnameTo, toHide = false;

	for (var i = 0; i < classList.length; i++) {
		if ( $.inArray(classList[i], availableTypes) !== -1 ){
			classnameTo = classList[i];
		}else if( $.inArray(classList[i], ['hidden-type']) !== -1 ){
			toHide = true;
		}
	}
	filterList(classnameTo, toHide);
});

$('#pokedex').on('click', function(){
	$('#pokedex').removeClass('opened_pkdx');
	$('.chosenOne').removeClass('chosenOne');
	$('#container').removeClass('container-calc');
	$('#mobile-filter-membrane').css({
		'display':'none'
	});
	$masonryContainer.masonry('layout'); //mas
});

$('#show-next-pack').on('click', function(){
	if (allLoaded){
		$('#show-next-pack-text').text("Great work! You catch 'em all!");
		document.getElementById('show-next-pack').style.pointerEvents = 'none';
	}else{
		$('#show-next-pack-text').text('Hmmmm... Let me think.');
		document.getElementById('show-next-pack').style.pointerEvents = 'none';
	}
	showNextPack();
});

$(window).bind('scroll', function (){
	if ($(window).scrollTop() > 80) {
		$('#pokedex').addClass('fixed_pkdx');
	} else {
		$('#pokedex').removeClass('fixed_pkdx');
	}
});

$('#filter-open').on('click', function(){
	$('header').css({
		top: '0px',
		left: '0px'
	});
	$('#filter-membrane').css({
		display: 'block'
	});
});

$('#filter-membrane').on('click', function(){
	$('header').css({
		top: '0px',
		left: '-263px'
	});
	$('#filter-membrane').css({
		display: 'none'
	});
});

}

function showNextPack(){

	var temp = newMonsters.objects;

	printPack(temp);
	if (!(allLoaded)){
		preloadPack();
	}
}

function filterList(classname, isHidden){
	if (isHidden){
		$('<style id="'+classname+'_box'+'">').text('.'+classname+'_box { display: none; }').appendTo('head');
		$masonryContainer.masonry('layout');//mas
	}else{
		$('#'+classname+'_box').remove();
		$masonryContainer.masonry('layout');//mas
	}
}

function printPack(pack){
	var innerBox = '', sizeType, typesBlock, backgroundImage, additionalClass;
	pack.forEach(function (object, index){
		typesBlock='', typesClasses='';

		object.types.forEach(function (typeObject){
			typesBlock += '<div class="typeBox '+typeObject.name+'"></div>';
			typesClasses += typeObject.name+'_box ';
		});

		if (object.weight > 1000){
			sizeType = 'grid-item grid-item--width3';
		}else if(object.weight > 500){
			sizeType = 'grid-item grid-item--width2';
		}else{
			sizeType = 'grid-item';
		}

		if (parseInt(object.pkdx_id) > 9999){
			// return;
			backgroundImage = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIgICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgICB2aWV3Qm94PSIwIDAgODkuMTIwODU3IDE3NS40NDM4NiIgICBoZWlnaHQ9IjE3NS40NDM4NiIgICB3aWR0aD0iODkuMTIwODU3IiAgIHZlcnNpb249IjEuMSIgICBpZD0ic3ZnNDE5MCI+ICA8bWV0YWRhdGEgICAgIGlkPSJtZXRhZGF0YTQxOTYiPiAgICA8cmRmOlJERj4gICAgICA8Y2M6V29yayAgICAgICAgIHJkZjphYm91dD0iIj4gICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PiAgICAgICAgPGRjOnR5cGUgICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+ICAgICAgICA8ZGM6dGl0bGU+PC9kYzp0aXRsZT4gICAgICA8L2NjOldvcms+ICAgIDwvcmRmOlJERj4gIDwvbWV0YWRhdGE+ICA8ZGVmcyAgICAgaWQ9ImRlZnM0MTk0IiAvPiAgPGcgICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xOC4zNzkxNDQsLTE3LjA1NjE0MikiICAgICBpZD0iZzQyMDAiPiAgICA8cGF0aCAgICAgICBpZD0icGF0aDQyMDQiICAgICAgIGQ9Im0gNTguNjM5MTUxLDE4OS4wODM0NSBjIC0zLjYwMTc0NSwtOS40NzMzMSAtNy43NTAzNTYsLTI2LjcyMjI0IC02LjY4MzYyMSwtMjcuNzg4ODkgMC42NDMyMDksLTAuNjQzMTYgOC4zOTIwNzgsLTEuMzM4MTcgMTcuMjE5NzA5LC0xLjU0NDQ3IGwgMTYuMDUwMjQsLTAuMzc1MDkgNC44MDYwMDUsMTEuODQ0ODMgYyA0LjkwMTgzNywxMi4wODEwMSA0LjkyNjc1LDE1LjAxMDA4IDAuMTI3OTYsMTUuMDQ0OTYgLTEuMTE4OTQ0LDAuMDA3IC03LjY1ODEzNCwxLjQxNDM3IC0xNC41MzE1MzMsMy4xMjUgQyA2OC43NTQ1MTMsMTkxLjEwMDQgNjIuNDEyNDY1LDE5Mi41IDYxLjUzNDQ3MiwxOTIuNSBjIC0wLjg3Nzk5MiwwIC0yLjE4MDg4NiwtMS41Mzc0NSAtMi44OTUzMjEsLTMuNDE2NTUgeiBtIDcuOTM5NzAxLC00NS4wMzEzIC0xNS4yOTYxNDcsLTAuMzc4ODQgMC42ODYwNjUsLTExLjUyNDE1IGMgMC4zNzczMzYsLTYuMzM4MjggMC44OTI4NCwtMTQuMDU1NDEgMS4xNDU1NjQsLTE3LjE0OTE2IDAuMjUyNzI0LC0zLjA5Mzc1IDAuNDk5MTM1LC05LjA1NTk5IDAuNTQ3NTgyLC0xMy4yNDk0MiBMIDUzLjc1LDk0LjEyNjE1NSA2OC4xODc5MDcsODEuMzAxNDA5IDgyLjYyNTgxNSw2OC40NzY2NjQgODIuMjUwNDA3LDYyLjY3NTgzMyA4MS44NzUsNTYuODc1IDc1LjAzNzk1OSw1Ni40ODc2NTQgQyA2Ni4zODU2NDMsNTUuOTk3NDY2IDY1LDU3LjY0NzA1MSA2NSw2OC40Mzc2ODQgNjUsNzIuODE1NjA2IDY0LjU0MzUyOSw3Ni4xMTU0MjcgNjMuOTg1NjE5LDc1Ljc3MDYyIDYzLjQyNzcwOSw3NS40MjU4MTIgNTUuOTgyNjgzLDc0LjUzNjg3NSA0Ny40NDExMTUsNzMuNzk1MjA0IDM4LjM5MTI1Niw3My4wMDkzOTYgMzEuMzMyNjI5LDcxLjgwNTg0MiAzMC41MjQ5MjYsNzAuOTEwODU0IDI5LjM1NDI3LDY5LjYxMzY5IDIyLjc1OTg4OSw1MC4yMzE2NjYgMTguODQ1NTI4LDM2LjU4MzA4NCAxNy4zOTk5NTcsMzEuNTQyNjc2IDE4LjQ5NzAyNCwzMC41NzAwNjEgMzQuMTcwMDQ1LDIyLjk5Njk5OSBsIDEyLjI5NTA0NSwtNS45NDA4NTcgMjcuNDIwNzA1LDYuMDQyMjgzIGMgMTUuMDgxMzg4LDMuMzIzMjU1IDI4LjIyMjk2NSw2LjY1NzQ5NyAyOS4yMDM1MDUsNy40MDk0MjkgMS4zMjEzOSwxLjAxMzMxIDIuMTIyODcsNi45MzUzMDcgMy4wOTY3NSwyMi44ODEzMzQgMC43MjI2NywxMS44MzI4MDMgMS4zMTM5NSwyMi42ODA0NDkgMS4zMTM5NSwyNC4xMDU4ODIgMCwxLjU1Mjc2MiAtNC4yMjIzNSw2Ljk3MTcxNiAtMTAuNTMyOTc2LDEzLjUxNzk4OCBsIC0xMC41MzI5NzYsMTAuOTI2MjkyIC0xLjAyOTUyNCwyMS4xMTcyMSBjIC0wLjYwNDIyNSwxMi4zOTM2NCAtMS41NDU5MDEsMjEuMTcwMzQgLTIuMjc5NTI0LDIxLjI0NTgxIC0wLjY4NzUsMC4wNzA4IC04LjEzMzI2NiwtMC4wNDE5IC0xNi41NDYxNDgsLTAuMjUwMjIgeiIgICAgICAgc3R5bGU9ImZpbGw6I2Y1YWQwOCIgLz4gICAgPHBhdGggICAgICAgaWQ9InBhdGg0MjAyIiAgICAgICBkPSJtIDU4LjYzOTE1MSwxODkuMDgzNDUgYyAtMy42MDE3NDUsLTkuNDczMzEgLTcuNzUwMzU2LC0yNi43MjIyNCAtNi42ODM2MjEsLTI3Ljc4ODg5IDAuNjQzMjA5LC0wLjY0MzE2IDguMzkyMDc4LC0xLjMzODE3IDE3LjIxOTcwOSwtMS41NDQ0NyBsIDE2LjA1MDI0LC0wLjM3NTA5IDQuODA2MDA1LDExLjg0NDgzIGMgNC45MDE4MzcsMTIuMDgxMDEgNC45MjY3NSwxNS4wMTAwOCAwLjEyNzk2LDE1LjA0NDk2IC0xLjExODk0NCwwLjAwNyAtNy42NTgxMzQsMS40MTQzNyAtMTQuNTMxNTMzLDMuMTI1IEMgNjguNzU0NTEzLDE5MS4xMDA0IDYyLjQxMjQ2NSwxOTIuNSA2MS41MzQ0NzIsMTkyLjUgYyAtMC44Nzc5OTIsMCAtMi4xODA4ODYsLTEuNTM3NDUgLTIuODk1MzIxLC0zLjQxNjU1IHogbSAxOC41ODA0MjksLTMuMzA4NiBjIDcuMDY0NTIsLTEuNjA3MjkgMTMuMTE2MTc5LC0zLjE5Mzk0IDEzLjQ0ODEzMSwtMy41MjU5IDAuNjU1NjE1LC0wLjY1NTYxIC02LjQzNzMxOSwtMTguNTE4NTYgLTcuOTU2NDg2LC0yMC4wMzc3MiAtMS4xMDg3OTksLTEuMTA4ODEgLTI0LjM5MjAxMywwLjI1OTkyIC0yNi40OTEyMjUsMS41NTczMSAtMS44Mjc3MzgsMS4xMjk2MSA0LjY0MDE2MiwyNC45OTUzMiA2Ljc2MzEyMiwyNC45NTUwNiAwLjc2NTUzMywtMC4wMTQ1IDcuMTcxOTM5LC0xLjM0MTQ2IDE0LjIzNjQ1OCwtMi45NDg3NSB6IG0gLTEwLjY0MDcyOCwtNDEuNzIyNyAtMTUuMjk2MTQ3LC0wLjM3ODg0IDAuNjg2MDY1LC0xMS41MjQxNSBjIDAuMzc3MzM2LC02LjMzODI4IDAuODkyODQsLTE0LjA1NTQxIDEuMTQ1NTY0LC0xNy4xNDkxNiAwLjI1MjcyNCwtMy4wOTM3NSAwLjQ5OTEzNSwtOS4wNTU5OSAwLjU0NzU4MiwtMTMuMjQ5NDIgTCA1My43NSw5NC4xMjYxNTUgNjguMTg3OTA3LDgxLjMwMTQwOSA4Mi42MjU4MTUsNjguNDc2NjY0IDgyLjI1MDQwNyw2Mi42NzU4MzMgODEuODc1LDU2Ljg3NSA3NS4wMzc5NTksNTYuNDg3NjU0IEMgNjYuMzg1NjQzLDU1Ljk5NzQ2NiA2NSw1Ny42NDcwNTEgNjUsNjguNDM3Njg0IDY1LDcyLjgxNTYwNiA2NC41NDM1MjksNzYuMTE1NDI3IDYzLjk4NTYxOSw3NS43NzA2MiA2My40Mjc3MDksNzUuNDI1ODEyIDU1Ljk4MjY4Myw3NC41MzY4NzUgNDcuNDQxMTE1LDczLjc5NTIwNCAzOC4zOTEyNTYsNzMuMDA5Mzk2IDMxLjMzMjYyOSw3MS44MDU4NDIgMzAuNTI0OTI2LDcwLjkxMDg1NCAyOS4zNTQyNyw2OS42MTM2OSAyMi43NTk4ODksNTAuMjMxNjY2IDE4Ljg0NTUyOCwzNi41ODMwODQgMTcuMzk5OTU3LDMxLjU0MjY3NiAxOC40OTcwMjQsMzAuNTcwMDYxIDM0LjE3MDA0NSwyMi45OTY5OTkgbCAxMi4yOTUwNDUsLTUuOTQwODU3IDI3LjQyMDcwNSw2LjA0MjI4MyBjIDE1LjA4MTM4OCwzLjMyMzI1NSAyOC4yMjI5NjUsNi42NTc0OTcgMjkuMjAzNTA1LDcuNDA5NDI5IDEuMzIxMzksMS4wMTMzMSAyLjEyMjg3LDYuOTM1MzA3IDMuMDk2NzUsMjIuODgxMzM0IDAuNzIyNjcsMTEuODMyODAzIDEuMzEzOTUsMjIuNjgwNDQ5IDEuMzEzOTUsMjQuMTA1ODgyIDAsMS41NTI3NjIgLTQuMjIyMzUsNi45NzE3MTYgLTEwLjUzMjk3NiwxMy41MTc5ODggbCAtMTAuNTMyOTc2LDEwLjkyNjI5MiAtMS4wMjk1MjQsMjEuMTE3MjEgYyAtMC42MDQyMjUsMTIuMzkzNjQgLTEuNTQ1OTAxLDIxLjE3MDM0IC0yLjI3OTUyNCwyMS4yNDU4MSAtMC42ODc1LDAuMDcwOCAtOC4xMzMyNjYsLTAuMDQxOSAtMTYuNTQ2MTQ4LC0wLjI1MDIyIHogTSA4Mi41LDEyMS4wMzM0MiBDIDgzLjIwNjExOSw5OC44OTkwNDMgODEuNzg4NDM0LDEwMi4yOTYyMyA5Ny4wMTU1MTIsODYuMjUgbCA3LjcxMDIxOCwtOC4xMjUgLTEuMDM5NTQsLTE3LjUgQyAxMDMuMTE0NDQsNTEgMTAyLjYxMzY1LDQwLjgxOTk3OSAxMDIuNTczMzIsMzguMDAyNzMgTCAxMDIuNSwzMi44ODA0NiA3NS45MDM0OTcsMjcuMDY1MjMgQyA2MS4yNzU0MjEsMjMuODY2ODU0IDQ4LjMyNjY4MSwyMS4yNSA0Ny4xMjg1MiwyMS4yNSBjIC0xLjY5MDk2NiwwIC0yMy44MzczNywxMC4yNjc4NzQgLTI1LjY0NDkzMywxMS44ODk5MTggLTAuNzMyOTgyLDAuNjU3NzU0IDEwLjAyODcyOSwzMy43Mjg0OTEgMTEuNDYzMjI3LDM1LjIyNjQ5MSAwLjg4NzM2OCwwLjkyNjY1IDYuNjM0OTYsMS42MzY2NjUgMTUuMTc4MTg2LDEuODc1IEwgNjEuODc1LDcwLjYyNSA2Mi41LDYxLjI1IGwgMC42MjUsLTkuMzc1IDEwLDAuNDM2OTY1IGMgNS41LDAuMjQwMzMxIDEwLjM2NDkyOSwwLjgwMjgzMSAxMC44MTA5NTMsMS4yNSAwLjQ0NjAyMywwLjQ0NzE3IDEuMTk1NTY3LDQuMjUyNzQ2IDEuNjY1NjUzLDguNDU2ODM2IGwgMC44NTQ3MDMsNy42NDM4MDMgLTE0LjMyNzI3MSwxMi4zNTYxOTcgQyA1NS42NTg3MzQsOTYuMjIzMjA2IDU2LjkyNzg0OSw5My4xMDYzOTcgNTUuNTQ4NDM1LDEyMi43Mzg5NCBsIC0wLjc5NjY2NSwxNy4xMTM5NSA2LjA2MTYxNSwwLjQ5ODk1IGMgMy4zMzM4ODksMC4yNzQ0MiA5LjQzNjYxNSwwLjQ0ODE1IDEzLjU2MTYxNSwwLjM4NjA2IGwgNy41LC0wLjExMjkgMC42MjUsLTE5LjU5MTU4IHoiICAgICAgIHN0eWxlPSJmaWxsOiMxMDYyOWIiIC8+ICA8L2c+PC9zdmc+';
			additionalClass = 'pokemon-image-unknown';
		}else{
			backgroundImage = 'http://pokeapi.co/media/img/'+object.pkdx_id+'.png';
			additionalClass = '';
		}

		innerBox += '<div id="box'+object.pkdx_id+'" class="box fade-in '+sizeType+' '+typesClasses+'"><div class="pokemon-types">'+typesBlock+'</div><div class="pokemon-image '+additionalClass+'" style="background-image:url('+backgroundImage+')"></div><div class="pokemon-text">'+object.name+'</div></div>';
	});

	$masonryContainer.append($(innerBox)).masonry('appended', $(innerBox), false);//mas
	$masonryContainer.masonry('reloadItems'); //mas
	$masonryContainer.masonry('layout'); //mas
}

function preloadPack(){

	if (newMonsters){
		var temp = visibleMonsers;
		visibleMonsers.meta = newMonsters.meta;
		newMonsters.objects.forEach(function(e){
			temp.objects.push(e);
		});
		visibleMonsers = temp;
	}

	var regex = /[?&]([^=#]+)=([^&#]*)/g,
		queryString = visibleMonsers.meta.next,
		params = {}, match;
	
		while(match = regex.exec(queryString)) {
			params[match[1]] = match[2];
		}

	var newUrl = "http://pokeapi.co"+visibleMonsers.meta.next,
	summ = parseInt(params.offset) + parseInt(params.limit);

	if (summ >= pokemonsLimit){
		var limit = pokemonsLimit - parseInt(params.offset);
		newUrl = 'http://pokeapi.co/api/v1/pokemon/?limit='+limit+'&offset='+params.offset;
		allLoaded = true;
	}

	console.log(newUrl);

	$.ajax({
		url: newUrl
	}).then(function(data){
		newMonsters = data;
		$('#show-next-pack-text').text("That's not all. I can show you more! (Click)");
		document.getElementById('show-next-pack').style.pointerEvents = 'auto'; 
	});
}
