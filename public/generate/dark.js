document.addEventListener('DOMContentLoaded', function () {
            const darkModeToggle = document.getElementById('darkModeToggle');

            darkModeToggle.addEventListener('change', function () {
                document.body.classList.toggle('dark-mode', darkModeToggle.checked);
                document.getElementById('output-container').classList.toggle('dark-mode', darkModeToggle.checked);
            });
        });

        document.getElementById('tabsButton').addEventListener('click', function() {
            var variationCount = document.getElementById('variationCount').value;
            for (var i = 0; i < variationCount; i++) {
                window.open('https://create.roblox.com/dashboard/creations?activeTab=Decal', '_blank');
            }
        });
