// Wait for the DOM to load completely before adding event listeners
document.addEventListener('DOMContentLoaded', function () {
    // Handle form submission
    document.getElementById('fstab-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const device = getInputValue('device');
        const mountPoint = getInputValue('mount-point');
        const fsType = getInputValue('fs-type');
        const dump = getInputValue('dump');
        const pass = getInputValue('pass');

        // Get selected options
        const options = gatherSelectedOptions();

        // Generate and display fstab entry
        const fstabEntry = generateFstabEntry(device, mountPoint, fsType, options, dump, pass);
        displayOutput(fstabEntry);
        displayWarning();
    });

    // Function to get input value
    function getInputValue(id) {
        return document.getElementById(id).value;
    }

    // Function to gather selected options from checkboxes
    function gatherSelectedOptions() {
        const options = [];
        const optionIds = [
            'defaults', 'noatime', 'nodiratime', 'rw', 'ro', 'nosuid', 'noexec',
            'nodev', 'async', 'atime', 'x-systemd.device-timeout=1', 'x-systemd.mount-timeout=1',
            'user_xattr', 'quota', 'grpquota', 'usrquota', 'discard', 
            // Add NFS specific options
            'mountvers', 'tcp', 'nolock', 'rsize', 'wsize',
            // Add CIFS/SMB specific options
            'credentials', 'uid', 'gid', 'file_mode', 'dir_mode'
        ];

        optionIds.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox && checkbox.checked) {
                let optionText = id.replace(/([A-Z])/g, ' $1').toLowerCase(); // Format option text

                // Special handling for options that require additional input
                if (id === 'mountvers' && document.getElementById('mountvers').value) {
                    optionText += `=${document.getElementById('mountvers').value}`;
                }
                if (id === 'rsize' && document.getElementById('rsize').value) {
                    optionText += `=${document.getElementById('rsize').value}`;
                }
                if (id === 'wsize' && document.getElementById('wsize').value) {
                    optionText += `=${document.getElementById('wsize').value}`;
                }
                if (id === 'credentials' && document.getElementById('credentials').value) {
                    optionText += `=${document.getElementById('credentials').value}`;
                }
                if (id === 'uid' && document.getElementById('uid').value) {
                    optionText += `=${document.getElementById('uid').value}`;
                }
                if (id === 'gid' && document.getElementById('gid').value) {
                    optionText += `=${document.getElementById('gid').value}`;
                }
                if (id === 'file_mode' && document.getElementById('file_mode').value) {
                    optionText += `=${document.getElementById('file_mode').value}`;
                }
                if (id === 'dir_mode' && document.getElementById('dir_mode').value) {
                    optionText += `=${document.getElementById('dir_mode').value}`;
                }

                options.push(optionText); // Add the formatted option
            }
        });

        return options;
    }

    // Function to generate fstab entry string with proper alignment
    function generateFstabEntry(device, mountPoint, fsType, options, dump, pass) {
        // Max width for each field to ensure alignment
        const deviceWidth = 30;
        const mountPointWidth = 30;
        const fsTypeWidth = 10;
        const optionsWidth = 30; // Reduced width for options

        const optionsStr = options.join(', ').padEnd(optionsWidth, ' '); // Ensure options are padded
        const fstabEntry = 
            `${device.padEnd(deviceWidth, ' ')}\t${mountPoint.padEnd(mountPointWidth, ' ')}\t` +
            `${fsType.padEnd(fsTypeWidth, ' ')}\t${optionsStr}\t${dump}\t${pass}`;

        // Adding comment line
        const commentLine = 
            `# device${' '.repeat(deviceWidth - 6)} mountPoint${' '.repeat(mountPointWidth - 10)} ` +
            `fsType${' '.repeat(fsTypeWidth - 7)} options${' '.repeat(optionsWidth - 7)} dump pass`;

        return `${commentLine}\n${fstabEntry}`;
    }

    // Function to display the generated fstab entry
    function displayOutput(fstabEntry) {
        const outputElement = document.getElementById('output');
        outputElement.textContent = `# Generated fstab entry:\n${fstabEntry}`;

        // Enable the copy button after generating the fstab entry
        document.getElementById('copy-btn').style.display = 'inline-block';
    }

    // Copy to clipboard function
    function copyToClipboard() {
        const outputText = document.getElementById('output').textContent;
        navigator.clipboard.writeText(outputText).then(() => {
            alert('fstab entry copied to clipboard!');
        }).catch((error) => {
            console.error('Error copying to clipboard: ', error);
        });
    }

    // Function to display a warning to reload the systemd daemon
    function displayWarning() {
        document.getElementById('warning').style.display = 'block';
    }

    // Set the current year in the footer
    function setFooterYear() {
        const year = new Date().getFullYear();
        document.getElementById('year').textContent = year;
    }

    // Call the function to set the year when the page loads
    setFooterYear();  // Set the year in the footer
});