<script>
	import { pb } from '$lib/pocketbase';

	import Swal from 'sweetalert2';

	function sweetAlert(icon, title) {
		Swal.fire({
			icon: icon,
			title: title,
			showConfirmButton: false,
			timer: 1500
		});
	}

	let upcoming_events = $state([]);

	async function refresh() {
		const records = await pb.collection('upcoming_events').getFullList({
			sort: '-created'
		});

		upcoming_events = records;
	}

	$effect(() => {
		refresh();
	});

	let name = $state('');
	let info = $state('');
	let date = $state('');
	let time = $state('');
	let venue = $state('');
	let link = $state('');

	const handleUpload = async (e) => {
		e.preventDefault();

		try {
			let data = new FormData();

			data.append('name', name);
			data.append('info', info);
			data.append('date', date);
			data.append('time', time);
			data.append('venue', venue);
			data.append('link', link);

			const record = await pb.collection('upcoming_events').create(data);

			if (record) {
				sweetAlert('success', 'Record Uploaded Successfully!');
				refresh();
			}
		} catch (error) {
			sweetAlert('error', 'An error occured');

			console.log(error);
		}
	};

	function handleFileInput(event) {
		image = event.target.files[0];
	}

	const getImageUrl = (record, filename) => {
		return `${pb.baseUrl}/api/files/${record.collectionId}/${record.id}/${filename}`;
	};

	const handleDelete = async (id) => {
		try {
			const record = await pb.collection('upcoming_events').delete(id);

			console.log(record);

			if (record) {
				sweetAlert('success', 'Record Deleted Successfully!');

				refresh();
			}
		} catch (error) {
			sweetAlert('error', 'An error has occurred!');

			console.log(error);
		}
	};

	let showForm = $state(false);

	function toggleForm() {
		showForm = !showForm;
	}
</script>

<main>
	<h1 class="text-center">Upcoming Events</h1>
	<hr />
	<div class="text-center mb-4">
		<button onclick={toggleForm} class="btn btn-lg btn-outline-dark">
			{showForm ? 'Hide Form' : 'Add New Item'}
		</button>
	</div>

	{#if showForm}
		<form action="submit" onsubmit={handleUpload} class="form-control">
			<label for="name" class="form-label">Event: </label>
			<input bind:value={name} type="text" class="form-control" required />
			<br />
			<label for="name" class="form-label">Details: </label>
			<textarea bind:value={info} class="form-control" required name="details" id="text"></textarea>
			<br />
			<label for="name" class="form-label">Venue: </label>
			<input required class="form-control" bind:value={venue} />

			<br />
			<div style="display: flex;" class="mb-3">
				<label for="tags" class="form-label">Date: </label>
				<input type="date" bind:value={date} class="form-control" required />
				&nbsp;
				<label for="tags" class="form-label">Time: </label>
				<input bind:value={time} type="time" class="form-control" required />
			</div>
			<label for="tags" class="form-label">Link: </label>
			<input bind:value={link} class="form-control" required />
			<br />
			<div class="text-center">
				<button type="submit" class="btn btn-lg btn-outline-dark">Upload</button>
			</div>
		</form>
	{/if}

	{#await upcoming_events}
		<p>Loading...</p>
	{:then upcoming_events}
		<div class="gallery-container p-2">
			{#each upcoming_events as data}
				<div class="imageDiv">
					<h2 class="text-center mb-2 mt-2">{data.name}</h2>
					<p>{data.info}</p>
					<p>Date: <span class="text-secondary">{data.date.replace('00:00:00.000Z', '')}</span></p>
					<p>Time: <span class="text-secondary">{data.time}</span></p>
					<p>Venue: <span class="text-secondary">{data.venue}</span></p>
					<a href={data.link} target="_blank">Register</a>
					<div class="p-2 text-center">
						<button class="btn btn-outline-danger" onclick={handleDelete(data.id)}>Delete</button>
					</div>
				</div>
			{/each}
		</div>
	{/await}
</main>
