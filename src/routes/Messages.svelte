<script>
	import { pb } from '$lib/pocketbase';
	import { onDestroy } from 'svelte';

	let messages = $state([]);
	let isLoading = $state(true);
	let error = $state(null);
	import Loader from './Loader.svelte';
	import Loader2 from './loader2.svelte';

	let isReadingMeassage = $state(false);
	let isUpdating = $state('');

	// Fetch initial messages
	async function fetchMessages() {
		try {
			isLoading = true;
			messages = await pb.collection('messages').getFullList({
				sort: '-created'
			});
			error = null;
		} catch (err) {
			error = 'Failed to load messages';
			console.error('Error fetching messages:', err);
		} finally {
			isLoading = false;
		}
	}

	// Mark message as read
	const markAsRead = async (id) => {
		try {
			isUpdating = id;
			isReadingMeassage = true;
			await pb.collection('messages').update(id, { is_read: true });
			messages = await pb.collection('messages').getFullList({
				sort: '-created'
			});

			isReadingMeassage = false;
		} catch (err) {
			isReadingMeassage = false;
			console.error('Error marking message as read:', err);
		}
	};

	const deleteMessage = async (id) => {
		await pb.collection('messages').delete(id);
		messages = await pb.collection('messages').getFullList({
			sort: '-created'
		});
	};

	// Initial fetch
	fetchMessages();
</script>

<main class="messages-container">
	<h1 class="messages-title">Messages</h1>

	{#if isLoading}
		<Loader />
	{:else if error}
		<div class="error-message">{error}</div>
	{:else if !messages.length}
		<div class="empty-state">No messages found</div>
	{:else}
		<div class="messages-list gallery-container">
			{#each messages as message (message.id)}
				{#if isReadingMeassage && isUpdating == messages.id}
					<Loader />
				{/if}
				<article class="message-card {message.is_read ? 'read' : 'unread'}">
					<div class="message-status">
						{message.is_read ? 'Read' : 'Unread'}
					</div>

					<div class="message-header">
						<h2 class="message-sender"><strong>From:</strong> {message.name}</h2>
						<p><strong>Subject: </strong> {message.subject.toUpperCase()}</p>
						<p><strong>Tel: +254</strong>{message.phone}</p>
						<a class="message-email" href="mailto:{message.email}"
							><strong>Email:</strong> {message.email}</a
						>
					</div>

					<div class="message-content">
						{message.message}
					</div>

					<div class="message-footer">
						<time class="message-date" datetime={message.created}>
							{new Date(message.created).toLocaleString()}
						</time>

						{#if !message.is_read}
							&nbsp;&nbsp; <button
								class="btn btn-outline-dark"
								onclick={() => markAsRead(message.id)}
							>
								Mark as Read
							</button>
						{:else}
							&nbsp;&nbsp;<button
								class="btn btn-outline-danger"
								onclick={deleteMessage(message.id)}
							>
								Delete <i class="fa-solid fa-trash"></i></button
							>
						{/if}
					</div>
				</article>
			{/each}
		</div>
	{/if}
</main>

<style>
	.messages-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.messages-title {
		text-align: center;
		margin-bottom: 2rem;
		color: var(--text-primary);
		font-size: 2rem;
	}

	.messages-list {
		display: grid;
		gap: 1.5rem;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	}

	.message-card {
		border-radius: 8px;
		padding: 1rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		background: white;
	}

	.message-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.message-card.unread {
		border-left: 4px solid var(--accent-color);
	}

	.message-status {
		display: inline-block;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;

		font-size: 0.75rem;
		font-weight: bold;
		margin-bottom: 1rem;
	}

	.message-card.unread .message-status {
		background-color: teal;
		color: whitesmoke;
	}

	.message-card.read .message-status {
		background-color: goldenrod;
		color: white;
	}

	.message-header {
		margin-bottom: 1rem;
	}

	.message-sender {
		font-size: 1.25rem;
		margin: 0 0 0.25rem 0;
		color: var(--text-primary);
	}

	.message-email {
		color: var(--text-secondary);
		font-size: 0.9rem;
		text-decoration: none;
	}

	.message-email:hover {
		text-decoration: underline;
	}

	.message-content {
		margin-bottom: 1.5rem;
		line-height: 1.5;
		color: var(--text-primary);
	}

	.message-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.85rem;
	}

	.message-date {
		color: var(--text-tertiary);
	}

	.empty-state,
	.error-message {
		text-align: center;
		padding: 2rem;
		color: var(--text-secondary);
	}

	.error-message {
		color: var(--error-color);
	}
</style>
