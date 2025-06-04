<script>
	import Swal from 'sweetalert2';
	import { pb } from '$lib/pocketbase';

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

		try {
			const authData = await pb.collection('users').authWithPassword(email, password);

			if (pb.authStore.isValid) {
				sweetAlert('success', 'You have successfully logged in!');
			} else {
				sweetAlert('error', 'Incorrect Password or username!');
			}
		} catch (error) {
			sweetAlert('error', 'Incorrect Password or username!');
		}
	}
</script>

<h1 class="text-center mt-4">Igat Admin Dash!</h1>
<main>
	<!-- From Uiverse.io by glisovic01 -->
	<div class="login-box">
		<p>Login</p>
		<form onsubmit={logIn}>
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
	/* From Uiverse.io by glisovic01 */
	.login-box {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 400px;
		padding: 40px;
		margin: 20px auto;
		transform: translate(-50%, -55%);
		background: rgba(0, 0, 0, 0.9);
		box-sizing: border-box;
		box-shadow: 0 15px 25px rgba(0, 0, 0, 0.6);
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
