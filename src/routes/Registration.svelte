<script>
  import { pb } from '$lib/pocketbase';
  import { onMount } from 'svelte';

  let registrations = [];
  let filteredRegistrations = [];
  let searchTerm = '';
  let loading = true;
  let error = '';
  let success = '';
  let editingRecord = null;
  let showEditModal = false;
  let newRecord = {
    name: '',
    phone: '',
    mpesa_ref: '',
    approved: false
  };

  // Fetch all registrations
  async function fetchRegistrations() {
    try {
      loading = true;
      const records = await pb.collection('registration').getFullList({
        sort: '-created'
      });
      registrations = records;
      filteredRegistrations = records;
      error = '';
    } catch (err) {
      error = 'Failed to fetch registrations: ' + err.message;
      console.error(err);
    } finally {
      loading = false;
    }
  }

  // Search functionality
  function handleSearch() {
    if (!searchTerm) {
      filteredRegistrations = registrations;
      return;
    }
    
    const term = searchTerm.toLowerCase();
    filteredRegistrations = registrations.filter(reg => 
      reg.name.toLowerCase().includes(term) || 
      reg.mpesa_ref.toLowerCase().includes(term)
    );
  }

  // Approve a registration
  async function approveRegistration(id) {
    try {
      await pb.collection('registration').update(id, { approved: true });
      success = 'Registration approved successfully!';
      await fetchRegistrations();
      setTimeout(() => success = '', 3000);
    } catch (err) {
      error = 'Failed to approve registration: ' + err.message;
      console.error(err);
    }
  }

  // Delete a registration
  async function deleteRegistration(id) {
    if (!confirm('Are you sure you want to delete this registration?')) return;
    
    try {
      await pb.collection('registration').delete(id);
      success = 'Registration deleted successfully!';
      await fetchRegistrations();
      setTimeout(() => success = '', 3000);
    } catch (err) {
      error = 'Failed to delete registration: ' + err.message;
      console.error(err);
    }
  }

  // Create a new registration
  async function createRegistration() {
    try {
      await pb.collection('registration').create(newRecord);
      success = 'Registration created successfully!';
      newRecord = { name: '', phone: '', mpesa_ref: '', approved: false };
      await fetchRegistrations();
      setTimeout(() => success = '', 3000);
    } catch (err) {
      error = 'Failed to create registration: ' + err.message;
      console.error(err);
    }
  }

  // Update a registration
  async function updateRegistration() {
    try {
      await pb.collection('registration').update(editingRecord.id, editingRecord);
      success = 'Registration updated successfully!';
      showEditModal = false;
      editingRecord = null;
      await fetchRegistrations();
      setTimeout(() => success = '', 3000);
    } catch (err) {
      error = 'Failed to update registration: ' + err.message;
      console.error(err);
    }
  }

  // Open edit modal
  function openEditModal(record) {
    editingRecord = {...record};
    showEditModal = true;
  }

  onMount(() => {
    fetchRegistrations();
  });
</script>

<main class="container-fluid p-4 bg-light min-vh-100">
  <div class="row">
    <div class="col-12">
      <h1 class="mb-4 text-dark">
        <i class="fas fa-users-cog me-2"></i>Registration Admin Dashboard
      </h1>
      
      <!-- Alert Messages -->
      {#if error}
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          <i class="fas fa-exclamation-circle me-2"></i>{error}
          <button type="button" class="btn-close" on:click={() => error = ''}></button>
        </div>
      {/if}
      
      {#if success}
        <div class="alert alert-success alert-dismissible fade show" role="alert">
          <i class="fas fa-check-circle me-2"></i>{success}
          <button type="button" class="btn-close" on:click={() => success = ''}></button>
        </div>
      {/if}
      
      <!-- Search and Controls -->
      <div class="card mb-4 border-0 shadow-sm">
        <div class="card-body">
          <div class="row align-items-center">
            <div class="col-md-6 mb-3 mb-md-0">
              <div class="input-group">
                <span class="input-group-text bg-white border-end-0">
                  <i class="fas fa-search text-secondary"></i>
                </span>
                <input 
                  type="text" 
                  class="form-control border-start-0" 
                  placeholder="Search by name or M-Pesa reference..." 
                  bind:value={searchTerm}
                  on:input={handleSearch}
                >
              </div>
            </div>
            <div class="col-md-6 text-md-end">
              <button 
                class="btn btn-dark" 
                on:click={fetchRegistrations}
              >
                <i class="fas fa-sync-alt me-2"></i>Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Add New Registration -->
      <div class="card mb-4 border-0 shadow-sm">
        <div class="card-header bg-dark text-white">
          <h5 class="mb-0">
            <i class="fas fa-plus-circle me-2"></i>Add New Registration
          </h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-3 mb-3">
              <label class="form-label">Name</label>
              <input 
                type="text" 
                class="form-control" 
                bind:value={newRecord.name}
                placeholder="Enter name"
              >
            </div>
            <div class="col-md-3 mb-3">
              <label class="form-label">Phone</label>
              <input 
                type="number" 
                class="form-control" 
                bind:value={newRecord.phone}
                placeholder="Enter phone number"
              >
            </div>
            <div class="col-md-3 mb-3">
              <label class="form-label">M-Pesa Reference</label>
              <input 
                type="text" 
                class="form-control" 
                bind:value={newRecord.mpesa_ref}
                placeholder="Enter M-Pesa reference"
              >
            </div>
            <div class="col-md-3 mb-3 d-flex align-items-end">
              <button 
                class="btn btn-dark w-100" 
                on:click={createRegistration}
                disabled={!newRecord.name || !newRecord.phone || !newRecord.mpesa_ref}
              >
                <i class="fas fa-save me-2"></i>Create
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Registrations Table -->
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white">
          <h5 class="mb-0">
            <i class="fas fa-list me-2"></i>Registered Members
          </h5>
        </div>
        <div class="card-body p-0">
          {#if loading}
            <div class="text-center p-5">
              <div class="spinner-border text-dark" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2 text-dark">Loading registrations...</p>
            </div>
          {:else if filteredRegistrations.length === 0}
            <div class="text-center p-5">
              <i class="fas fa-inbox fa-3x text-secondary mb-3"></i>
              <p class="text-dark">No registrations found.</p>
            </div>
          {:else}
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>M-Pesa Reference</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {#each filteredRegistrations as registration}
                    <tr>
                      <td class="align-middle">{registration.name}</td>
                      <td class="align-middle">{registration.phone}</td>
                      <td class="align-middle">
                        <span class="badge bg-light text-dark">{registration.mpesa_ref}</span>
                      </td>
                      <td class="align-middle">
                        {#if registration.approved}
                          <span class="badge bg-success">
                            <i class="fas fa-check-circle me-1"></i>Approved
                          </span>
                        {:else}
                          <span class="badge bg-warning text-dark">
                            <i class="fas fa-clock me-1"></i>Pending
                          </span>
                        {/if}
                      </td>
                      <td class="align-middle">
                        {new Date(registration.created).toLocaleDateString()}
                      </td>
                      <td class="align-middle">
                        <div class="btn-group btn-group-sm">
                          {#if !registration.approved}
                            <button 
                              class="btn btn-outline-success" 
                              on:click={() => approveRegistration(registration.id)}
                              title="Approve"
                            >
                              <i class="fas fa-check"></i>
                            </button>
                          {/if}
                          <button 
                            class="btn btn-outline-primary" 
                            on:click={() => openEditModal(registration)}
                            title="Edit"
                          >
                            <i class="fas fa-edit"></i>
                          </button>
                          <button 
                            class="btn btn-outline-danger" 
                            on:click={() => deleteRegistration(registration.id)}
                            title="Delete"
                          >
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
  
  <!-- Edit Modal -->
  {#if showEditModal}
    <div class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title">
              <i class="fas fa-edit me-2"></i>Edit Registration
            </h5>
            <button 
              type="button" 
              class="btn-close btn-close-white" 
              on:click={() => showEditModal = false}
            ></button>
          </div>
          <div class="modal-body">
            {#if editingRecord}
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input 
                  type="text" 
                  class="form-control" 
                  bind:value={editingRecord.name}
                >
              </div>
              <div class="mb-3">
                <label class="form-label">Phone</label>
                <input 
                  type="number" 
                  class="form-control" 
                  bind:value={editingRecord.phone}
                >
              </div>
              <div class="mb-3">
                <label class="form-label">M-Pesa Reference</label>
                <input 
                  type="text" 
                  class="form-control" 
                  bind:value={editingRecord.mpesa_ref}
                >
              </div>
              <div class="mb-3 form-check">
                <input 
                  type="checkbox" 
                  class="form-check-input" 
                  bind:checked={editingRecord.approved}
                  id="approvedCheck"
                >
                <label class="form-check-label" for="approvedCheck">Approved</label>
              </div>
            {/if}
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              on:click={() => showEditModal = false}
            >
              Cancel
            </button>
            <button 
              type="button" 
              class="btn btn-dark" 
              on:click={updateRegistration}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show"></div>
  {/if}
</main>

<style>
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
  @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');
  
  body {
    background-color: #f8f9fa;
  }
  
  .table th {
    border-top: none;
    font-weight: 600;
  }
  
  .badge {
    font-size: 0.85em;
  }
  
  .btn-group .btn {
    border-radius: 0.25rem !important;
  }
  
  .modal-backdrop {
    opacity: 0.5;
  }
  
  .card {
    border-radius: 0.5rem;
  }
  
  .form-control:focus {
    border-color: #212529;
    box-shadow: 0 0 0 0.25rem rgba(33, 37, 41, 0.25);
  }
</style>