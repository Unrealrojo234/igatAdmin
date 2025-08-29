<script>
  import { pb } from '$lib/pocketbase';
  import { onMount } from 'svelte';

  let renewals = [];
  let filteredRenewals = [];
  let searchTerm = '';
  let loading = true;
  let error = '';
  let success = '';
  let editingRecord = null;
  let showEditModal = false;
  let showRewindModal = false;
  let newRecord = {
    name: '',
    phone: '',
    mpesa_ref: '',
    approved: false
  };

  // Fetch all renewals
  async function fetchRenewals() {
    try {
      loading = true;
      const records = await pb.collection('renewal').getFullList({
        sort: '-created'
      });
      renewals = records;
      filteredRenewals = records;
      error = '';
    } catch (err) {
      error = 'Failed to fetch renewals: ' + err.message;
      console.error(err);
    } finally {
      loading = false;
    }
  }

  // Search functionality
  function handleSearch() {
    if (!searchTerm) {
      filteredRenewals = renewals;
      return;
    }
    
    const term = searchTerm.toLowerCase();
    filteredRenewals = renewals.filter(renewal => 
      renewal.name.toLowerCase().includes(term) || 
      renewal.mpesa_ref.toLowerCase().includes(term)
    );
  }

  // Approve a renewal
  async function approveRenewal(id) {
    try {
      await pb.collection('renewal').update(id, { approved: true });
      success = 'Renewal approved successfully!';
      await fetchRenewals();
      setTimeout(() => success = '', 3000);
    } catch (err) {
      error = 'Failed to approve renewal: ' + err.message;
      console.error(err);
    }
  }

  // Delete a renewal
  async function deleteRenewal(id) {
    if (!confirm('Are you sure you want to delete this renewal?')) return;
    
    try {
      await pb.collection('renewal').delete(id);
      success = 'Renewal deleted successfully!';
      await fetchRenewals();
      setTimeout(() => success = '', 3000);
    } catch (err) {
      error = 'Failed to delete renewal: ' + err.message;
      console.error(err);
    }
  }

  // Create a new renewal
  async function createRenewal() {
    try {
      await pb.collection('renewal').create(newRecord);
      success = 'Renewal created successfully!';
      newRecord = { name: '', phone: '', mpesa_ref: '', approved: false };
      await fetchRenewals();
      setTimeout(() => success = '', 3000);
    } catch (err) {
      error = 'Failed to create renewal: ' + err.message;
      console.error(err);
    }
  }

  // Update a renewal
  async function updateRenewal() {
    try {
      await pb.collection('renewal').update(editingRecord.id, editingRecord);
      success = 'Renewal updated successfully!';
      showEditModal = false;
      editingRecord = null;
      await fetchRenewals();
      setTimeout(() => success = '', 3000);
    } catch (err) {
      error = 'Failed to update renewal: ' + err.message;
      console.error(err);
    }
  }

  // Rewind functionality - start fresh renewal for everyone
  async function rewindRenewals() {
    showRewindModal = false;
    
    try {
      // Get all renewal records
      const allRecords = await pb.collection('renewal').getFullList();
      
      // Delete all records
      for (const record of allRecords) {
        await pb.collection('renewal').delete(record.id);
      }
      
      success = 'Renewals reset successfully! A fresh renewal cycle has started.';
      await fetchRenewals();
      setTimeout(() => success = '', 5000);
    } catch (err) {
      error = 'Failed to reset renewals: ' + err.message;
      console.error(err);
    }
  }

  // Open edit modal
  function openEditModal(record) {
    editingRecord = {...record};
    showEditModal = true;
  }

  onMount(() => {
    fetchRenewals();
  });
</script>

<main class="container-fluid p-4 bg-light min-vh-100">
  <div class="row">
    <div class="col-12">
      <h1 class="mb-4 text-dark">
        <i class="fas fa-sync-alt me-2"></i>Renewal Admin Dashboard
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
                class="btn btn-danger me-2" 
                on:click={() => showRewindModal = true}
                title="Start fresh renewal for everyone"
              >
                <i class="fas fa-undo me-2"></i>Rewind Renewals
              </button>
              <button 
                class="btn btn-dark" 
                on:click={fetchRenewals}
              >
                <i class="fas fa-sync-alt me-2"></i>Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Add New Renewal -->
      <div class="card mb-4 border-0 shadow-sm">
        <div class="card-header bg-dark text-white">
          <h5 class="mb-0">
            <i class="fas fa-plus-circle me-2"></i>Add New Renewal
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
                on:click={createRenewal}
                disabled={!newRecord.name || !newRecord.phone || !newRecord.mpesa_ref}
              >
                <i class="fas fa-save me-2"></i>Create
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Renewals Table -->
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white">
          <h5 class="mb-0">
            <i class="fas fa-list me-2"></i>Renewal Records
          </h5>
        </div>
        <div class="card-body p-0">
          {#if loading}
            <div class="text-center p-5">
              <div class="spinner-border text-dark" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2 text-dark">Loading renewals...</p>
            </div>
          {:else if filteredRenewals.length === 0}
            <div class="text-center p-5">
              <i class="fas fa-inbox fa-3x text-secondary mb-3"></i>
              <p class="text-dark">No renewals found.</p>
              <button class="btn btn-dark" on:click={fetchRenewals}>
                <i class="fas fa-sync-alt me-2"></i>Refresh
              </button>
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
                  {#each filteredRenewals as renewal}
                    <tr>
                      <td class="align-middle">{renewal.name}</td>
                      <td class="align-middle">{renewal.phone}</td>
                      <td class="align-middle">
                        <span class="badge bg-light text-dark">{renewal.mpesa_ref}</span>
                      </td>
                      <td class="align-middle">
                        {#if renewal.approved}
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
                        {new Date(renewal.created).toLocaleDateString()}
                      </td>
                      <td class="align-middle">
                        <div class="btn-group btn-group-sm">
                          {#if !renewal.approved}
                            <button 
                              class="btn btn-outline-success" 
                              on:click={() => approveRenewal(renewal.id)}
                              title="Approve"
                            >
                              <i class="fas fa-check"></i>
                            </button>
                          {/if}
                          <button 
                            class="btn btn-outline-primary" 
                            on:click={() => openEditModal(renewal)}
                            title="Edit"
                          >
                            <i class="fas fa-edit"></i>
                          </button>
                          <button 
                            class="btn btn-outline-danger" 
                            on:click={() => deleteRenewal(renewal.id)}
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
              <i class="fas fa-edit me-2"></i>Edit Renewal
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
              on:click={updateRenewal}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show"></div>
  {/if}
  
  <!-- Rewind Modal -->
  {#if showRewindModal}
    <div class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">
              <i class="fas fa-exclamation-triangle me-2"></i>Confirm Rewind
            </h5>
            <button 
              type="button" 
              class="btn-close btn-close-white" 
              on:click={() => showRewindModal = false}
            ></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to reset all renewals? This action will:</p>
            <ul>
              <li>Delete all existing renewal records</li>
              <li>Start a fresh renewal cycle for everyone</li>
            </ul>
            <p class="fw-bold">This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              on:click={() => showRewindModal = false}
            >
              Cancel
            </button>
            <button 
              type="button" 
              class="btn btn-danger" 
              on:click={rewindRenewals}
            >
              <i class="fas fa-undo me-2"></i>Confirm Rewind
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
  
  .btn-danger {
    background-color: #dc3545;
    border-color: #dc3545;
  }
  
  .btn-danger:hover {
    background-color: #bb2d3b;
    border-color: #b02a37;
  }
</style>