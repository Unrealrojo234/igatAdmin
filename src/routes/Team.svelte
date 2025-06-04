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

	let team = $state([]);

	async function refresh() {
		const records = await pb.collection('team').getFullList({
			sort: '-created'
		});

		team = records;
	}

	$effect(() => {
		refresh();
	});

	let name = $state('');
	let info = $state('');
	let phone = $state('');
	let email = $state('');
	let photo = $state('');
	let position = $state('');

	const handleUpload = async (e) => {
		e.preventDefault();

		//         const data = {
		//     "name": "test",
		//     "position": "test",
		//     "info": "test",
		//     "email": "test@example.com",
		//     "phone": 123
		// };

		try {
			let data = new FormData();

			data.append('name', name);
			data.append('info', info);
			data.append('phone', phone);
			data.append('email', email);
			data.append('position', position);
			data.append('photo', photo);

			const record = await pb.collection('team').create(data);

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
		photo = event.target.files[0];
	}

	const getImageUrl = (record, filename) => {
		return `${pb.baseUrl}/api/files/${record.collectionId}/${record.id}/${filename}`;
	};

	const handleDelete = async (id) => {
		try {
			const record = await pb.collection('team').delete(id);

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
</script>

<main>
	<h1 class="text-center">Team</h1>
	<hr />
	<form action="submit" onsubmit={handleUpload} class="form-control">
		<label for="name" class="form-label">Name: </label>
		<input bind:value={name} type="text" class="form-control" required />
		<br />
		<label for="name" class="form-label">Position: </label>
		<input required class="form-control" bind:value={position} />

		<br />
		<label for="name" class="form-label">Info: </label>
		<textarea bind:value={info} class="form-control" required name="details" id="text"></textarea>
		<br />
		<div style="display: flex;" class="mb-3">
			<label for="tags" class="form-label">Email: </label>
			<input type="mail" bind:value={email} class="form-control" required />
			&nbsp;
			<label for="tags" class="form-label">Phone: </label>
			<input bind:value={phone} type="number" class="form-control" required />
		</div>
		<br />
		<label for="image" class="form-label">Profile Picture</label>
		<input accept="image/*" onchange={handleFileInput} type="file" required class="form-control" />
		<br />
		<div class="text-center">
			<button type="submit" class="btn btn-lg btn-outline-dark">Upload</button>
		</div>
	</form>

	{#await team}
		<p>Loading...</p>
	{:then team}
		<div class="gallery-container">
			{#each team as data}
				<div class="imageDiv">
					<img src={getImageUrl(data, data.photo)} alt={data.name} />
					<h2 class="text-center mb-1">{data.name}</h2>
					<h4>{data.position}</h4>
					<p>{data.info}</p>
					<a href={`mailto:${data.email}`}>{data.email}</a>
					<a href={`tel:${data.phone}`}>{data.phone}</a>
					<div class="p-2 text-center">
						<button class="btn btn-outline-danger" onclick={handleDelete(data.id)}>Delete</button>
					</div>
				</div>
			{/each}
		</div>
	{/await}
</main>

<style>
	form {
		max-width: 32rem;
		margin: auto;
		padding: 1rem;
	}

	.gallery-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: 1.5rem;
		padding: 2rem;
		max-width: 1200px;
		margin: auto;
	}

	.imageDiv {
		border: 1px solid #ddd;
		border-radius: 8px;
		overflow: hidden;
		background-color: #fff;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		transition: transform 0.2s ease;
	}

	.imageDiv:hover {
		transform: scale(1.03);
	}

	img {
		width: 100%;
		height: 9rem;
		display: block;
	}
</style>
