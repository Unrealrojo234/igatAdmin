<script>
	import { pb } from '$lib/pocketbase';

	import Swal from 'sweetalert2';
	import Loader from './Loader.svelte';

	function sweetAlert(icon, title) {
		Swal.fire({
			icon: icon,
			title: title,
			showConfirmButton: false,
			timer: 1500
		});
	}

	let loading = $state(true);

	let news = $state([]);

	async function refresh() {
		const records = await pb.collection('news').getFullList({
			sort: '-created'
		});

		news = records;

		loading = false;
	}

	$effect(() => {
		refresh();
	});

	let name = $state('');
	let details = $state('');
	let image = $state('');
	let tags = $state('');

	const handleUpload = async (e) => {
		e.preventDefault();

		try {
			let data = new FormData();

			data.append('headline', name);
			data.append('info', details);
			data.append('tag', tags);
			data.append('backgroundImage', image);

			const record = await pb.collection('news').create(data);

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
			const record = await pb.collection('news').delete(id);

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

{#if loading}
	<Loader />
{/if}

<main>
	<h1 class="text-center">News</h1>
	<hr />
	<div class="text-center mb-4">
		<button onclick={toggleForm} class="btn btn-lg btn-outline-dark">
			{showForm ? 'Hide Form' : 'Add New Item'}
		</button>
	</div>
	{#if showForm}
		<form action="submit" onsubmit={handleUpload} class="form-control">
			<label for="name" class="form-label">Headline: </label>
			<input bind:value={name} type="text" class="form-control" required />
			<br />
			<label for="name" class="form-label">Details: </label>
			<textarea bind:value={details} class="form-control" required name="details" id="text"
			></textarea>
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
			<label for="tags" class="form-label">Tags: </label>
			<input bind:value={tags} class="form-control" required />
			<br />
			<div class="text-center">
				<button type="submit" class="btn btn-lg btn-outline-dark">Upload</button>
			</div>
		</form>
	{/if}

	{#await news}
		<p>Loading...</p>
	{:then news}
		<div class="gallery-container">
			{#each news as data}
				<div class="imageDiv">
					<img src={getImageUrl(data, data.backgroundImage)} alt={data.headline} />
					<h3>{data.headline}</h3>
					<p>{data.info}</p>
					<p class="text-secondary">{data.tags}</p>
					<div class="p-2">
						<button class="btn btn-outline-danger" onclick={handleDelete(data.id)}>Delete</button>
					</div>
				</div>
			{/each}
		</div>
	{/await}
</main>
