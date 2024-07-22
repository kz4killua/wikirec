mkdir package

pip install \
--platform manylinux2014_x86_64 \
--target=package \
--implementation cp \
--python-version 3.12 \
--only-binary=:all: --upgrade \
-r requirements.txt

cd package
zip -r ../deployment_package.zip .

cd ..
zip deployment_package.zip *.py
zip deployment_package.zip tiktoken_cache