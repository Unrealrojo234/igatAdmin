<script>
	import { pb } from '$lib/pocketbase';

	import Swal from 'sweetalert2';

	let showForm = $state(false);

	import Loader from './Loader.svelte';

	let loading = $state(true);

	function toggleForm() {
		showForm = !showForm;
	}

	function sweetAlert(icon, title) {
		Swal.fire({
			icon: icon,
			title: title,
			showConfirmButton: false,
			timer: 1500
		});
	}

	let gallery = $state([]);

	async function refresh() {
		const records = await pb.collection('gallery').getFullList({
			sort: '-created'
		});

		gallery = records;

		loading = false;
	}

	$effect(() => {
		refresh();
	});

	let name = $state('');
	let details = $state('');
	let image = $state('');
	let link = $state('');

	const handleUpload = async (e) => {
		e.preventDefault();

		try {
			let data = new FormData();

			data.append('name', name);
			data.append('info', details);
			data.append('link', link);
			data.append('image', image);

			const record = await pb.collection('gallery').create(data);

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
		Swal.fire({
			title: 'Are you sure you want to delete this?',
			showCancelButton: true,
			confirmButtonText: 'Yes',
			denyButtonText: `Cancel`
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					let record = await pb.collection('gallery').delete(id);
					if (record) {
						sweetAlert('success', 'Record Deleted Successfully!');

						refresh();
					}
				} catch (error) {
					sweetAlert('error', 'An error has occurred');
				}
			} else if (result.isDismissed) {
				sweetAlert('info', 'Deletion Cancelled');
			}
		});
	};
</script>

{#if loading}
	<Loader />
{/if}

<main>
	<h1 class="text-center">Gallery</h1>
	<hr />
	<div class="text-center mb-4">
		<button onclick={toggleForm} class="btn btn-lg btn-outline-dark">
			{showForm ? 'Hide Form' : 'Add New Item'}
		</button>
	</div>
	{#if showForm}
		<form action="submit" onsubmit={handleUpload} class="form-control">
			<label for="name" class="form-label">Name: </label>
			<input bind:value={name} type="text" class="form-control" required />
			<br />
			<label for="name" class="form-label">Details: </label>
			<input type="text" bind:value={details} class="form-control" required />
			<br />
			<label for="name" class="form-label">Image: </label>
			<input
				type="file"
				alt="image"
				oninput={handleFileInput}
				accept="image/*"
				required
				class="form-control"
			/>
			<br />
			<label for="link" class="form-label">Link: </label>
			<input bind:value={link} type="url" class="form-control" required />
			<br />
			<div class="text-center">
				<button type="submit" class="btn btn-lg btn-outline-dark">Upload</button>
			</div>
		</form>
	{/if}

	{#await gallery}
		<p>Loading...</p>
	{:then gallery}
		<div class="gallery-container">
			{#each gallery as data}
				<div class="imageDiv">
					<img src={getImageUrl(data, data.image)} alt={data.name} />
					<h3>{data.name}</h3>
					<p>{data.info}</p>
					<a href={data.link} target="_blank">View Project</a>
					<div class="p-2">
						<button class="btn btn-outline-danger" onclick={() => handleDelete(data.id)}
							>Delete <i class="fa-solid fa-trash"></i></button
						>
					</div>
				</div>
			{/each}
		</div>
	{/await}
</main>
