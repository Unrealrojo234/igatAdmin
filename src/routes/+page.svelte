<script>
	import Gallery from './Gallery.svelte';
	import News from './News.svelte';
	import UpcomingEvents from './UpcomingEvents.svelte';
	import Team from './Team.svelte';
	import Login from './Login.svelte';
	import { pb } from '$lib/pocketbase';
	import { onMount } from 'svelte';
	import Swal from 'sweetalert2';
	import Messages from './Messages.svelte';
	import Registration from './Registration.svelte';
	import Renewal from './Renewal.svelte';

	function sweetAlert(icon, title) {
		Swal.fire({
			icon: icon,
			title: title,
			showConfirmButton: false,
			timer: 1500
		});
	}

	let { data } = $props();

	const activeStyle = `background-color:#252525;color:white`;
	let active = $state(0);

	let isLoading = $state(true);

	const tabs = [
		{ id: 0, name: 'Gallery', icon: 'image' },
		{ id: 1, name: 'News', icon: 'newspaper' },
		{ id: 2, name: 'Team', icon: 'people-group' },
		{ id: 3, name: 'Upcoming-Events', icon: 'calendar-days' },
		{ id: 4, name: 'Messages', icon: 'comments' },
		{ id: 5, name: 'Registration', icon: 'user-plus' },
		{ id: 6, name: 'Renewal', icon: 'redo' },

	];

	const handleTabChange = (id) => {
		active = id;
	};

	onMount(() => {
		// Refresh auth state when client loads
		if (pb.authStore.isValid) {
			pb.collection('users')
				.authRefresh()
				.catch(() => pb.authStore.clear());
		}
		console.log(pb.authStore.isValid);
	});

	let isLoggedIn = $state(null);

	isLoggedIn = data.user | false;

	setTimeout(() => {
		setInterval(async () => {
			if (pb.authStore.isValid) {
				isLoggedIn = true;
			} else {
				isLoggedIn = false;
			}
		}, 1000);
	}, 2000);

	//Logout
	async function handleLogout() {
		Swal.fire({
			title: 'Are you sure you want to logout?',
			showCancelButton: true,
			confirmButtonText: 'Yes',
			denyButtonText: `Cancel`
		}).then(async (result) => {
			try {
				if (result.isConfirmed) {
					// Clear the auth store
					pb.authStore.clear();

					sweetAlert('success', 'logged-out successfully');
				}
			} catch (error) {
				console.error('Logout failed:', err);
				sweetAlert('error', 'error logging out');
			}
		});
	}
</script>

<svelte:head>
	<title>Igat Admin</title>
</svelte:head>

{#if !isLoggedIn}
	<Login />
{:else}
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

				<button class="mt-3 btn btn-outline-danger" onclick={handleLogout}>
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
					<Messages />
				{:else if active === 5}
					<Registration />
				{:else if active === 6}
					<Renewal />
				{:else}
					<Gallery />
				{/if}
			</div>
		</div>
	</main>
{/if}

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
