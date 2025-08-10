import urlRepository from "#features/url/data-access/url.repository.js";
let batch_start_id = -1;
let local_counter = 0;
const batch_size = 5

async function get_new_batch() {
    let { batch_start } = await urlRepository.getIdBatch(batch_size);
    batch_start_id = Number(batch_start);
}

export default async function generate_id(): Promise<number> {
    // Get a new batch when all the id batch is consumed, or when the machine just restarts 
    if (batch_start_id == -1 || local_counter == batch_size) {
        await get_new_batch();
        local_counter = 0;
    }

    // Update local counter, so no need to call DB
    let current_id = batch_start_id + local_counter;
    local_counter++

    return current_id;
}