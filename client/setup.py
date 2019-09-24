import setuptools

setuptools.setup(name='pbstracker',
    version='0.1',
    description='Python client for PBS job status tracker.',
    url='http://github.com/rwalle/pbstracker',
    author='Zhe Li',
    author_email='lizhe05@gmail.com',
    license='MIT',
    packages=setuptools.find_packages(),
    install_requires=['requests',],
    package_data={'pbstracker': ['report_finished_bash.sh']},
    include_package_data=True,
    entry_points = {
        'console_scripts': [
            'psub = pbstracker.__main__:main'
        ]
    }
)
