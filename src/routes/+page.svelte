<script>
	import Gallery from './Gallery.svelte';
	import News from './News.svelte';
</script>

<main class="container-fluid">
	<h1 class="text-center">IGAT Admin Dashboard</h1>
	<div class="div">
		<div class="card p-2" id="pane">
			<button class="btn btn-outline-dark">Gallery <i class="fa-solid fa-image"></i></button>
			<button class="btn btn-outline-dark">News <i class="fa-solid fa-newspaper"></i></button>
			<button class="btn btn-outline-dark">Team <i class="fa-solid fa-people-group"></i></button>
			<button class="btn btn-outline-dark"
				>Upcoming-Events <i class="fa-solid fa-calendar-days"></i></button
			>
			<button class="btn btn-outline-dark">Messages <i class="fa-solid fa-comments"></i></button>
			<button class="mt-3 btn btn-outline-danger"
				>Logout <i class="fa-solid fa-right-from-bracket"></i></button
			>
		</div>
		<div class="contents card">
			<!-- <Gallery /> -->
			<News />
		</div>
	</div>
</main>
;

<style>
	.div {
		display: flex;
	}

	#pane {
		width: 13rem;
		height: 100vh;
		position: sticky;
		top: 0;
	}

	.contents {
		flex: 1;
		margin-left: 2rem;
		padding: 1rem;
	}

	button {
		margin-bottom: 1.5rem;
	}
</style>
