<script>
	import Swal from 'sweetalert2';
	import { pb } from '$lib/pocketbase';
	import Loader2 from './loader2.svelte';
	import Loader from './Loader.svelte';

	function refresh() {
		window.location.reload();
	}

	let isLoading = $state(false);

	function sweetAlert(icon, title) {
		Swal.fire({
			icon: icon,
			title: title,
			showConfirmButton: false,
			timer: 2000
		});
	}

	let email = $state('');

	let password = $state('');

	async function logIn(e) {
		e.preventDefault();

		isLoading = true;

		try {
			const authData = await pb.collection('users').authWithPassword(email, password);

			isLoading = false;

			if (pb.authStore.isValid) {
				sweetAlert('success', 'You have successfully logged in!');
				refresh();
			} else {
				isLoading = false;

				sweetAlert('error', 'Incorrect Password or username!');
			}
		} catch (error) {
			isLoading = false;

			sweetAlert('error', 'Incorrect Password or username!');
		}
	}
</script>

<main class="container2">
	<h1>Igat Admin Dashboard Login</h1>
	<!-- From Uiverse.io by glisovic01 -->
	<div class="login-box">
		<p>Login</p>
		<form onsubmit={logIn}>
			{#if isLoading}
				<Loader2 />
			{/if}
			<div class="user-box">
				<input required bind:value={email} name="" type="text" />
				<!-- svelte-ignore a11y_label_has_associated_control -->
				<label>Email/Username</label>
			</div>
			<div class="user-box">
				<input required name="" bind:value={password} type="password" />
				<!-- svelte-ignore a11y_label_has_associated_control -->
				<label>Password</label>
			</div>
			<div class="d-grid">
				<button type="submit" class="btn btn-outline-light">Login</button>
			</div>
		</form>
		<!-- svelte-ignore a11y_invalid_attribute -->
		<p>Forgot Password? <a href="" class="a2">Reset!</a></p>
	</div>
</main>

<style>
	main {
		height: 100vh;
		width: 100%;
		overflow: hidden;
		background-image: url('https://i.pinimg.com/originals/f3/8e/18/f38e1822bbfa446f9ccc75a875c454be.gif');
		/* background-image: url('https://i.pinimg.com/originals/b0/c2/98/b0c2988dae6c0f5b02e7433021a91f39.gif'); */
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
	}
	h1 {
		font-size: 3rem;
		text-align: center;
		margin-top: 12px;
		color: aqua;
	}
	.login-box {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 400px;
		padding: 40px;
		margin: 20px auto;
		transform: translate(-50%, -55%);
		box-sizing: border-box;
		box-shadow: 0 15px 25px rgba(0, 236, 253, 0.6);
		border-radius: 10px;
	}

	.login-box p:first-child {
		margin: 0 0 30px;
		padding: 0;
		color: #fff;
		text-align: center;
		font-size: 1.5rem;
		font-weight: bold;
		letter-spacing: 1px;
	}

	.login-box .user-box {
		position: relative;
	}

	.login-box .user-box input {
		width: 100%;
		padding: 10px 0;
		font-size: 16px;
		color: #fff;
		margin-bottom: 30px;
		border: none;
		border-bottom: 1px solid #fff;
		outline: none;
		background: transparent;
	}

	.login-box .user-box label {
		position: absolute;
		top: 0;
		left: 0;
		padding: 10px 0;
		font-size: 16px;
		color: #fff;
		pointer-events: none;
		transition: 0.5s;
	}

	.login-box .user-box input:focus ~ label,
	.login-box .user-box input:valid ~ label {
		top: -20px;
		left: 0;
		color: #fff;
		font-size: 12px;
	}

	.login-box a:hover {
		background: #fff;
		color: #272727;
		border-radius: 5px;
	}

	@keyframes btn-anim1 {
		0% {
			left: -100%;
		}

		50%,
		100% {
			left: 100%;
		}
	}

	@keyframes btn-anim2 {
		0% {
			top: -100%;
		}

		50%,
		100% {
			top: 100%;
		}
	}

	@keyframes btn-anim3 {
		0% {
			right: -100%;
		}

		50%,
		100% {
			right: 100%;
		}
	}

	@keyframes btn-anim4 {
		0% {
			bottom: -100%;
		}

		50%,
		100% {
			bottom: 100%;
		}
	}

	.login-box p:last-child {
		color: #aaa;
		font-size: 14px;
	}

	.login-box a.a2 {
		color: #fff;
		text-decoration: none;
	}

	.login-box a.a2:hover {
		background: transparent;
		color: #aaa;
		border-radius: 5px;
	}
</style>
