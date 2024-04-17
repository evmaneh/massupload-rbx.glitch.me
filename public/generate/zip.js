var zip = new JSZip();

        function generateVariations() {
            var input = document.getElementById('imageInput');
            var variationCountInput = document.getElementById('variationCount');
            var baseNameInput = document.getElementById('baseName');
            var outputContainer = document.getElementById('output-container');
            var loadingBar = document.querySelector('.loading-bar');
            var loadingProgress = document.getElementById('loadingProgress');
            outputContainer.innerHTML = '';
            loadingBar.style.display = 'block';

            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    var img = new Image();
                    img.src = e.target.result;

                    img.onload = function () {
                        var variationCount = parseInt(variationCountInput.value, 10);
                        var baseName = baseNameInput.value.trim() || '_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_';
                        var completedVariations = 0;

                        for (var i = 0; i < variationCount; i++) {
                            setTimeout(function(index) {
                                var canvas = document.createElement('canvas');
                                canvas.width = img.width;
                                canvas.height = img.height;
                                var ctx = canvas.getContext('2d');
                                ctx.drawImage(img, 0, 0);

                                var x = Math.floor(Math.random() * img.width);
                                var y = Math.floor(Math.random() * img.height);
                                ctx.clearRect(x, y, 1, 1);

                                var variationImg = new Image();
                                variationImg.onload = function() {
                                    completedVariations++;
                                    loadingProgress.style.width = (completedVariations / variationCount) * 100 + '%';
                                    if (completedVariations === variationCount) {
                                        loadingBar.style.display = 'none';
                                    }
                                };
                                variationImg.src = canvas.toDataURL('image/png');
                                variationImg.classList.add('output-image');
                                outputContainer.appendChild(variationImg);

                                var base64 = variationImg.src.split(',')[1];
                                zip.file(`${baseName}_${index + 1}.png`, base64, { base64: true });
                            }, 0, i);
                        }
                    };
                };

                reader.readAsDataURL(input.files[0]);
            } else {
                alert('Please select an image.');
            }
        }

        function downloadZip() {
            var zipFileNameInput = document.getElementById('zipFileName');
            var zipFileName = zipFileNameInput.value.trim() || 'https://discord.gg/H2CrGNJ84r';

            zip.generateAsync({ type: 'blob' })
                .then(function (content) {
                    var downloadLink = document.createElement('a');
                    downloadLink.href = URL.createObjectURL(content);
                    downloadLink.download = zipFileName + '.zip';
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                    location.reload();
                });
        }

        function updateFileName() {
            const input = document.getElementById('imageInput');
            const fileName = input.files[0].name;
            document.getElementById('baseName').value = fileName.split('.')[0];
        }
