document.addEventListener('DOMContentLoaded', () => {
    // TAB SWITCHING LOGIC
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');

            navButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // CLOUD COST ESTIMATOR LOGIC
    const vcpusInput = document.getElementById('vcpus');
    const ramInput = document.getElementById('ram');
    const storageInput = document.getElementById('storage');
    const bandwidthInput = document.getElementById('bandwidth');
    const providerSelect = document.getElementById('cloud-provider');
    const regionSelect = document.getElementById('region');
    const managedDbCheckbox = document.getElementById('managed-db');
    const loadBalancerCheckbox = document.getElementById('load-balancer');

    const vcpuVal = document.getElementById('vcpu-val');
    const ramVal = document.getElementById('ram-val');
    const storageVal = document.getElementById('storage-val');
    const bandwidthVal = document.getElementById('bandwidth-val');

    const totalPriceEl = document.getElementById('total-price');
    const costComputeEl = document.getElementById('cost-compute');
    const costStorageEl = document.getElementById('cost-storage');
    const costNetworkEl = document.getElementById('cost-network');
    const costAddonsEl = document.getElementById('cost-addons');

    function calculateCost() {
        const vcpus = parseInt(vcpusInput.value);
        const ram = parseInt(ramInput.value);
        const storage = parseInt(storageInput.value);
        const bandwidth = parseInt(bandwidthInput.value);

        const providerMultiplier = parseFloat(providerSelect.value);
        const regionMultiplier = parseFloat(regionSelect.value);

        // Display Slider Values
        vcpuVal.textContent = vcpus;
        ramVal.textContent = ram;
        storageVal.textContent = storage;
        bandwidthVal.textContent = bandwidth;

        // Base Unit Pricing (Monthly Rates in USD)
        const cpuCost = vcpus * 12.00;
        const ramCost = ram * 3.50;
        const rawCompute = (cpuCost + ramCost) * providerMultiplier * regionMultiplier;

        const rawStorage = (storage * 0.08) * providerMultiplier;
        const rawNetwork = (bandwidth * 0.05) * providerMultiplier;

        let rawAddons = 0;
        if (managedDbCheckbox.checked) rawAddons += 45.00;
        if (loadBalancerCheckbox.checked) rawAddons += 20.00;

        const grandTotal = rawCompute + rawStorage + rawNetwork + rawAddons;

        // Update DOM
        totalPriceEl.textContent = grandTotal.toFixed(2);
        costComputeEl.textContent = `$${rawCompute.toFixed(2)}`;
        costStorageEl.textContent = `$${rawStorage.toFixed(2)}`;
        costNetworkEl.textContent = `$${rawNetwork.toFixed(2)}`;
        costAddonsEl.textContent = `$${rawAddons.toFixed(2)}`;
    }

    // Attach Event Listeners for Estimator Controls
    [vcpusInput, ramInput, storageInput, bandwidthInput, providerSelect, regionSelect, managedDbCheckbox, loadBalancerCheckbox].forEach(element => {
        element.addEventListener('input', calculateCost);
    });

    // Export Summary Action
    document.getElementById('btn-export').addEventListener('click', () => {
        const summary = `CloudSphere Architecture Estimate\n-------------------------------\nTotal Monthly Cost: $${totalPriceEl.textContent}\nvCPUs: ${vcpusInput.value}\nRAM: ${ramInput.value} GB\nStorage: ${storageInput.value} GB\nBandwidth: ${bandwidthInput.value} GB`;
        alert(summary);
    });

    // ARCHITECTURE BUILDER LOGIC
    const paletteButtons = document.querySelectorAll('.palette-btn');
    const canvas = document.getElementById('architecture-canvas');
    const emptyState = document.getElementById('empty-state');
    const nodeCountEl = document.getElementById('node-count');
    const clearCanvasBtn = document.getElementById('clear-canvas');

    let nodeCount = 0;

    paletteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const componentType = btn.getAttribute('data-type');
            const labelText = btn.textContent;

            addNodeToCanvas(labelText);
        });
    });

    function addNodeToCanvas(label) {
        if (nodeCount === 0) {
            emptyState.style.display = 'none';
        }

        nodeCount++;
        nodeCountEl.textContent = nodeCount;

        const node = document.createElement('div');
        node.className = 'arch-node';
        node.innerHTML = `
            <span>${label}</span>
            <span class="remove-node" title="Remove">&times;</span>
        `;

        node.querySelector('.remove-node').addEventListener('click', () => {
            node.remove();
            nodeCount--;
            nodeCountEl.textContent = nodeCount;
            if (nodeCount === 0) {
                emptyState.style.display = 'block';
            }
        });

        canvas.appendChild(node);
    }

    clearCanvasBtn.addEventListener('click', () => {
        const nodes = canvas.querySelectorAll('.arch-node');
        nodes.forEach(n => n.remove());
        nodeCount = 0;
        nodeCountEl.textContent = 0;
        emptyState.style.display = 'block';
    });

    // Initial Calculation Run
    calculateCost();
});