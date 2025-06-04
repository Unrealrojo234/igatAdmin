<script>
	import Gallery from './Gallery.svelte';
	import News from './News.svelte';
	import UpcomingEvents from './UpcomingEvents.svelte';
	import Team from './Team.svelte';

	const activeStyle = `background-color:#252525;color:white`;
	let active = $state(0);

	const tabs = [
		{ id: 0, name: 'Gallery', icon: 'image' },
		{ id: 1, name: 'News', icon: 'newspaper' },
		{ id: 2, name: 'Team', icon: 'people-group' },
		{ id: 3, name: 'Upcoming-Events', icon: 'calendar-days' },
		{ id: 4, name: 'Messages', icon: 'comments' }
	];

	const handleTabChange = (id) => (active = id);
</script>

<svelte:head>
	<title>Igat Admin</title>
</svelte:head>

<main class="container-fluid">
	<h1 class="text-center">IGAT Admin Dashboard</h1>
	<div class="div">
		<div class="card p-2" id="pane">
			{#each tabs as tab}
				<button
					style={active === tab.id ? activeStyle : ''}
					onclick={() => handleTabChange(tab.id)}
					class="btn btn-outline-dark"
				>
					{tab.name} <i class="fa-solid fa-{tab.icon}"></i>
				</button>
			{/each}

			<button class="mt-3 btn btn-outline-danger">
				Logout <i class="fa-solid fa-right-from-bracket"></i>
			</button>
		</div>

		<div class="contents card">
			{#if active === 0}
				<Gallery />
			{:else if active === 1}
				<News />
			{:else if active === 2}
				<Team />
			{:else if active === 3}
				<UpcomingEvents />
			{:else if active === 4}
				<h1 class="text-center">Coming Soon</h1>
			{:else}
				<Gallery />
			{/if}
		</div>
	</div>
</main>

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
